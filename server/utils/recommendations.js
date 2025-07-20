
const supabase = require("../supabaseClient.js");
const { loadGlove, getAverageVector } = require("./gloveLoader.js");
const cosineSimilarity = require("./cosineSimilarity.js");

// Helper function to ensure input is always an array
function safeArray(arr) {
  return Array.isArray(arr) ? arr : [];
}

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
  for (let i = 0; i < 300; i++) {
    userVector[i] =
      (ownershipVector[i] * 2 +
        categoriesVector[i] * 2 +
        ethicsVector[i] * 1.5 +
        environmentalVector[i] * 1.5 +
        socialVector[i]) /
      (
        (userOwnership.length ? 2 : 0) +
        (userCategories.length ? 2 : 0) +
        (userEthics.length ? 1.5 : 0) +
        (userEnvironmental.length ? 1.5 : 0) +
        (userPreferences.socialResponsibility === "Yes" ? 1 : 0) ||
        1
      );
  }

  // Fetch brands and products from Supabase
  const { data: brands } = await supabase.from("brands").select("*");
  const { data: products } = await supabase.from("products").select("*");
  if (!brands || !products) throw new Error("Could not fetch brands or products");

  // Score brands based on how well they match the user's preferences
  let brandCandidates = brands.map((brand) => {
    const brandOwnership = safeArray(brand.ownership);
    const brandTags = safeArray(brand.tags);
    const brandCategories = safeArray(brand.categories);

    // Check ownership match (boolean)
    const ownershipMatch =
      userOwnership.length === 0 ||
      userOwnership.some(
        (ownership) =>
          brandOwnership.some((bo) =>
            bo.toLowerCase().includes(ownership.toLowerCase())
          ) ||
          brandTags.some((tag) =>
            tag.toLowerCase().includes(ownership.toLowerCase())
          ) ||
          (brand.mission &&
            brand.mission.toLowerCase().includes(ownership.toLowerCase()))
      );

    // Calculate category match score (0-1)
    let categoryMatchScore = 0;
    if (userCategories.length > 0 && brandCategories.length > 0) {
      const matchingCategories = userCategories.filter((cat) =>
        brandCategories.some(
          (brandCat) =>
            brandCat.toLowerCase().includes(cat.toLowerCase()) ||
            cat.toLowerCase().includes(brandCat.toLowerCase())
        )
      );
      categoryMatchScore = matchingCategories.length / userCategories.length;
    }

    // Calculate ethics match score (0-1)
    const ethicsMatchScore =
      userEthics.length === 0
        ? 0
        : userEthics.filter(
            (ethic) =>
              brandTags.some((tag) =>
                tag.toLowerCase().includes(ethic.toLowerCase())
              ) ||
              (brand.mission &&
                brand.mission.toLowerCase().includes(ethic.toLowerCase()))
          ).length / userEthics.length;

    // Calculate environmental match score (0-1)
    const environmentalMatchScore =
      userEnvironmental.length === 0
        ? 0
        : userEnvironmental.filter(
            (env) =>
              brandTags.some((tag) =>
                tag.toLowerCase().includes(env.toLowerCase())
              ) ||
              (brand.mission &&
                brand.mission.toLowerCase().includes(env.toLowerCase()))
          ).length / userEnvironmental.length;

    // Combine scores with weighted average
    const primaryScore = (ownershipMatch ? 0.2 : 0) + categoryMatchScore * 0.8;
    const finalScore =
      primaryScore * 0.7 +
      ethicsMatchScore * 0.2 +
      environmentalMatchScore * 0.1;

    return {
      ...brand,
      primaryScore,
      ethicsMatchScore,
      environmentalMatchScore,
      score: finalScore,
    };
  });

  // Select at least 3 brands, with fallback to ethics/environmental matches
  let ownershipCategoryBrands = brandCandidates.filter((b) => b.primaryScore > 0);

  if (ownershipCategoryBrands.length < 3) {
    const needed = 3 - ownershipCategoryBrands.length;
    const fallbackBrands = brandCandidates
      .filter(
        (b) =>
          b.primaryScore === 0 &&
          (b.ethicsMatchScore > 0 || b.environmentalMatchScore > 0) &&
          !ownershipCategoryBrands.includes(b)
      )
      .sort(
        (a, b) =>
          b.ethicsMatchScore + b.environmentalMatchScore -
          (a.ethicsMatchScore + a.environmentalMatchScore)
      )
      .slice(0, needed);
    ownershipCategoryBrands = [...ownershipCategoryBrands, ...fallbackBrands];
  }

  const scoredBrands = ownershipCategoryBrands.slice(0, 3);

  console.log("Top brands:");
  scoredBrands.forEach((b) => {
    console.log(`- ${b.name}: score=${b.score.toFixed(2)}`);
  });

  // Score products based on user preferences and vector similarity
  const productCandidates = products
    .filter((p) => p.title)
    .map((product) => {
      const matchingBrand = brands.find((brand) => brand.id === product.brand_id);
      const brandOwnership = safeArray(matchingBrand?.ownership);
      const brandTags = safeArray(matchingBrand?.tags);
      const productCategories = safeArray(product.brand_categories);

      // Ownership match (boolean)
      const ownershipMatch =
        userOwnership.length === 0 ||
        userOwnership.some(
          (ownership) =>
            brandOwnership.some((bo) =>
              bo.toLowerCase().includes(ownership.toLowerCase())
            ) ||
            brandTags.some((tag) =>
              tag.toLowerCase().includes(ownership.toLowerCase())
            ) ||
            (matchingBrand?.mission &&
              matchingBrand.mission.toLowerCase().includes(ownership.toLowerCase()))
        );

      // Category match score (0-1)
      let categoryMatchScore = 0;
      if (userCategories.length > 0 && productCategories.length > 0) {
        const matchingCategories = userCategories.filter((cat) =>
          productCategories.some(
            (prodCat) =>
              prodCat.toLowerCase().includes(cat.toLowerCase()) ||
              cat.toLowerCase().includes(prodCat.toLowerCase())
          )
        );
        categoryMatchScore = matchingCategories.length / userCategories.length;
      }

      // Ethics match score (0-1)
      const ethicsMatchScore =
        userEthics.length === 0
          ? 0
          : userEthics.filter(
              (ethic) =>
                product.title.toLowerCase().includes(ethic.toLowerCase()) ||
                brandTags.some((tag) =>
                  tag.toLowerCase().includes(ethic.toLowerCase())
                ) ||
                (matchingBrand?.mission &&
                  matchingBrand.mission.toLowerCase().includes(ethic.toLowerCase()))
            ).length / userEthics.length;

      // Environmental match score (0-1)
      const environmentalMatchScore =
        userEnvironmental.length === 0
          ? 0
          : userEnvironmental.filter(
              (env) =>
                product.title.toLowerCase().includes(env.toLowerCase()) ||
                brandTags.some((tag) =>
                  tag.toLowerCase().includes(env.toLowerCase())
                ) ||
                (matchingBrand?.mission &&
                  matchingBrand.mission.toLowerCase().includes(env.toLowerCase()))
            ).length / userEnvironmental.length;

      // Vector similarity between user profile and product title
      const productVector =
        product.vector || getAverageVector(product.title.split(/\s+/));
      const vectorScore = cosineSimilarity(userVector, productVector);

      // Combine scores with weighted average
      const primaryScore = (ownershipMatch ? 0.4 : 0) + categoryMatchScore * 0.6;
      const finalScore =
        primaryScore * 0.5 +
        ethicsMatchScore * 0.2 +
        environmentalMatchScore * 0.2 +
        vectorScore * 0.1;

      return {
        ...product,
        primaryScore,
        vectorScore,
        ethicsMatchScore,
        environmentalMatchScore,
        score: finalScore,
      };
    });

  // Select top 6 products, ensuring only one product per brand
  const sortedProducts = productCandidates
    .filter((p) => p.primaryScore > 0.1)
    .sort((a, b) => b.score - a.score);

  const seenBrands = new Set();
  let scoredProducts = [];
  for (const product of sortedProducts) {
    if (!seenBrands.has(product.brand_id)) {
      seenBrands.add(product.brand_id);
      scoredProducts.push(product);
      if (scoredProducts.length >= 6) break;
    }
  }

  // Fallback if there are fewer than 6 products
  if (scoredProducts.length < 6) {
    console.log("Product fallback to ethics/environmental scoring");
    seenBrands.clear();
    const fallbackProducts = productCandidates
      .sort(
        (a, b) =>
          b.ethicsMatchScore + b.environmentalMatchScore -
          (a.ethicsMatchScore + a.environmentalMatchScore)
      );
    scoredProducts = [];
    for (const product of fallbackProducts) {
      if (!seenBrands.has(product.brand_id)) {
        seenBrands.add(product.brand_id);
        scoredProducts.push(product);
        if (scoredProducts.length >= 6) break;
      }
    }
  }

  console.log("Top products:");
  scoredProducts.forEach((p) => {
    console.log(`- ${p.title}: score=${p.score.toFixed(2)}`);
  });

  // Return the final recommendations
  return {
    brands: scoredBrands,
    products: scoredProducts,
  };
}

module.exports = { getRecommendations };
