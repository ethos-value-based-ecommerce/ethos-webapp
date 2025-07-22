
const supabase = require("../supabaseClient.js");
const { loadGlove, getAverageVector } = require("./gloveLoader.js");
const cosineSimilarity = require("./cosineSimilarity.js");

// Weights for user vector calculation
const OWNERSHIP_WEIGHT = 2.5;
const CATEGORY_WEIGHT = 3.0;
const ETHICS_WEIGHT = 2.0;
const ENVIRONMENTAL_WEIGHT = 2.0;
const SOCIAL_WEIGHT = 1.0;

// Weights for scoring logic
const BRAND_PRIMARY_WEIGHT = 0.5;
const BRAND_ETHICS_WEIGHT = 0.2;
const BRAND_ENVIRONMENTAL_WEIGHT = 0.2;
const BRAND_VECTOR_WEIGHT = 0.1;

const PRODUCT_PRIMARY_WEIGHT = 0.4;
const PRODUCT_ETHICS_WEIGHT = 0.2;
const PRODUCT_ENVIRONMENTAL_WEIGHT = 0.2;
const PRODUCT_VECTOR_WEIGHT = 0.2;

// Common stop words to ignore when creating GloVe vectors
const STOP_WORDS = new Set([
  "the", "and", "of", "in", "on", "for", "with", "a", "to", "at", "by", "from",
  "an", "or", "as", "is", "this", "that", "these", "those", "it"
]);

// Helper function to ensure input is always an array
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

// Convert an array of text into cleaned, tokenized words (lowercase, no stop words)
function cleanTextToWords(textArray) {
  return textArray
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word && !STOP_WORDS.has(word));
}

// Main Reccommendation Logic
async function getRecommendations(userPreferences) {
  // Load GloVe vectors into memory before any vector operations
  await loadGlove();

  //  Extract and normalize user quiz preferences
  const userOwnership = safeArray(userPreferences.ownership);
  const userCategories = safeArray(userPreferences.categories);
  const userEthics = safeArray(userPreferences.ethics);
  const userEnvironmental = safeArray(userPreferences.environmentalPractices);

  // Convert user preferences into vector representations using GloVe
  const ownershipVector = getAverageVector(userOwnership);
  const categoriesVector = getAverageVector(userCategories);
  const ethicsVector = getAverageVector(userEthics);
  const environmentalVector = getAverageVector(userEnvironmental);
  const socialVector =
    userPreferences.socialResponsibility?.toLowerCase() === "yes"
      ? getAverageVector(["social", "responsibility", "ethical", "sustainable"])
      : Array(300).fill(0);

  // Combine all preference vectors into a single "user profile vector"
  const userVector = Array(300).fill(0);

  // Effective divisor ensures we don’t divide by 0
  const divisor =
    (userOwnership.length ? OWNERSHIP_WEIGHT : 0) +
    (userCategories.length ? CATEGORY_WEIGHT : 0) +
    (userEthics.length ? ETHICS_WEIGHT : 0) +
    (userEnvironmental.length ? ENVIRONMENTAL_WEIGHT : 0) +
    (userPreferences.socialResponsibility?.toLowerCase() === "yes" ? SOCIAL_WEIGHT : 0);
  const effectiveDivisor = divisor || 1;

  for (let i = 0; i < 300; i++) {
    userVector[i] =
      (ownershipVector[i] * OWNERSHIP_WEIGHT +
        categoriesVector[i] * CATEGORY_WEIGHT +
        ethicsVector[i] * ETHICS_WEIGHT +
        environmentalVector[i] * ENVIRONMENTAL_WEIGHT +
        socialVector[i] * SOCIAL_WEIGHT) / effectiveDivisor;
  }

  // Fetch brands from Supabase
  const { data: brands, error: brandsError } = await supabase.from("brands").select("*");

  console.log("Brands fetched:", brands ? brands.length : 0, "Error:", brandsError);

  if (!brands || brands.length === 0) {
    console.error("No brands found in database", { brandsError });
    throw new Error("No brands found in database");
  }


  // Check if products table exists and has data
  const { data: products, error: productsError } = await supabase.from("products").select("*");

  console.log("Products fetched:", products ? products.length : 0, "Error:", productsError);

  // If no products, throw an error
  if (!products || products.length === 0) {
    console.error("No products found in database", { productsError });
    throw new Error("No products found in database");
  }

  // Use the actual products from the database
  let finalProducts = products;

   // Score brands based on how well they match the user's preferences
  let brandCandidates = brands.map((brand) => {
    const brandOwnership = safeArray(brand.ownership);
    const brandCategories = safeArray(brand.categories);

    // Build a brand vector from its name, ownership, and categories
    const brandWords = cleanTextToWords([
      brand.name || "",
      ...brandOwnership,
      ...brandCategories
    ]);
    const brandVector = getAverageVector(brandWords);

    // Cosine similarity between user & brand vectors
    const vectorScore = cosineSimilarity(userVector, brandVector);

    // Ownership match (true/false → used in primary score)
    const ownershipMatch =
      userOwnership.length === 0 ||
      userOwnership.some(o =>
        brandOwnership.some(bo => bo.toLowerCase().includes(o.toLowerCase()))
      );

    // Category match score (0–1)
    let categoryMatchScore = 0;
    if (userCategories.length && brandCategories.length) {
      const matching = userCategories.filter(cat =>
        brandCategories.some(bc => bc.toLowerCase().includes(cat.toLowerCase()))
      );
      categoryMatchScore = matching.length / userCategories.length;
    }

   // Calculate ethics match score (0-1)
    const ethicsMatchScore =
      userEthics.length === 0
        ? 0
        : userEthics.filter(ethic =>
            brandCategories.some(cat =>
              cat.toLowerCase().includes(ethic.toLowerCase())
            )
          ).length / userEthics.length;

    // Calculate environmental match score (0-1)
          const environmentalMatchScore =
      userEnvironmental.length === 0
        ? 0
        : userEnvironmental.filter(env =>
            brandCategories.some(cat =>
              cat.toLowerCase().includes(env.toLowerCase())
            )
          ).length / userEnvironmental.length;

    // Final weighted score
    const primaryScore = (ownershipMatch ? 0.4 : 0) + categoryMatchScore * 0.6;
    const finalScore =
      primaryScore * BRAND_PRIMARY_WEIGHT +
      ethicsMatchScore * BRAND_ETHICS_WEIGHT +
      environmentalMatchScore * BRAND_ENVIRONMENTAL_WEIGHT +
      vectorScore * BRAND_VECTOR_WEIGHT;

    return {
      ...brand,
      primaryScore,
      ethicsMatchScore,
      environmentalMatchScore,
      vectorScore,
      score: finalScore
    };
  });

  // Select at least 5 brands
  brandCandidates = brandCandidates.sort((a, b) => b.score - a.score);
  const scoredBrands = brandCandidates.slice(0, 5);

// Score products based on user preferences and vector similarity
  const productCandidates = finalProducts.map((product) => {
    const brand = brands.find(b => b.id === product.brand_id) || {};
    const productCategories = safeArray(product.brand_categories);

    // Build product vector from title, categories, and brand name
    const productWords = cleanTextToWords([
      product.title || "",
      ...productCategories,
      brand.name || ""
    ]);
    const productVector = product.vector || getAverageVector(productWords);

    const vectorScore = cosineSimilarity(userVector, productVector);

    // Ownership match (boolean)
    const ownershipMatch =
      userOwnership.length === 0 ||
      userOwnership.some(o =>
        safeArray(brand.ownership).some(bo =>
          bo.toLowerCase().includes(o.toLowerCase())
        )
      );

    // Category match score (0-1)
    let categoryMatchScore = 0;
    if (userCategories.length && productCategories.length) {
      const matching = userCategories.filter(cat =>
        productCategories.some(pc =>
          pc.toLowerCase().includes(cat.toLowerCase())
        )
      );
      categoryMatchScore = matching.length / userCategories.length;
    }

    // Ethics match score (0-1)
    const ethicsMatchScore =
      userEthics.length === 0
        ? 0
        : userEthics.filter(ethic =>
            productCategories.some(pc =>
              pc.toLowerCase().includes(ethic.toLowerCase())
            )
          ).length / userEthics.length;

    // Environmental match score (0-1)
    const environmentalMatchScore =
      userEnvironmental.length === 0
        ? 0
        : userEnvironmental.filter(env =>
            productCategories.some(pc =>
              pc.toLowerCase().includes(env.toLowerCase())
            )
          ).length / userEnvironmental.length;

   // Combine scores with weighted average
    const primaryScore = (ownershipMatch ? 0.4 : 0) + categoryMatchScore * 0.6;
    const finalScore =
      primaryScore * PRODUCT_PRIMARY_WEIGHT +
      ethicsMatchScore * PRODUCT_ETHICS_WEIGHT +
      environmentalMatchScore * PRODUCT_ENVIRONMENTAL_WEIGHT +
      vectorScore * PRODUCT_VECTOR_WEIGHT;

    return {
      ...product,
      primaryScore,
      ethicsMatchScore,
      environmentalMatchScore,
      vectorScore,
      score: finalScore,
      brandName: brand.name || "Unknown Brand"
    };
  });

 // Select top 10 products, ensuring only 2 products per brand and no duplicates
  let sortedProducts = productCandidates.sort((a, b) => b.score - a.score);

  const brandCount = {};
  const filteredProducts = [];
  const addedProductIds = new Set(); // Track product IDs that have been added
  const addedProductTitles = new Map(); // Track normalized product titles by brand

  for (const product of sortedProducts) {
    // Skip if this product ID has already been added
    if (addedProductIds.has(product.id)) continue;

    const brandName = product.brandName || "Unknown Brand";
    const normalizedTitle = product.title?.toLowerCase().trim() || "";

    // Check if we already have a product with similar title from this brand
    const brandProducts = addedProductTitles.get(brandName) || new Set();
    if (brandProducts.has(normalizedTitle)) continue;

    brandCount[brandName] = (brandCount[brandName] || 0);

    if (brandCount[brandName] < 2) {
      filteredProducts.push(product);
      brandCount[brandName]++;
      addedProductIds.add(product.id); // Mark this product ID as added

      // Track this product title for this brand
      if (!addedProductTitles.has(brandName)) {
        addedProductTitles.set(brandName, new Set());
      }
      addedProductTitles.get(brandName).add(normalizedTitle);
    }

    if (filteredProducts.length >= 10) break;
  }

  const scoredProducts = filteredProducts;

  // Return the final recommendations
  return {
    brands: scoredBrands,
    products: scoredProducts,
  };
}

module.exports = { getRecommendations };
