
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const { loadGlove, getAverageVector } = require('../utils/gloveLoader');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables! Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Same stop words we used in recommendations.js
const STOP_WORDS = new Set([
  "the", "and", "of", "in", "on", "for", "with", "a", "to", "at", "by", "from",
  "an", "or", "as", "is", "this", "that", "these", "those", "it"
]);

function cleanTextToWords(textArray) {
  return textArray
    .join(" ")
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word && !STOP_WORDS.has(word));
}

// Main function to load word vectors and update brand and product vectors
async function main() {
  await loadGlove(path.resolve(__dirname, '../data/glove.6B.300d.txt'));


  // Update brand vectors based on name, mission, and categories
  await updateBrandVectors();

  // Update product vectors by merging product text vector with brand vector
  await updateProductVectors();

  console.log("All vectors updated.");
}

// Update brand vectors in the database
async function updateBrandVectors() {
  const { data: brands, error } = await supabase.from('brands').select('*');
  if (error) throw error;

  for (let brand of brands) {
     // Combine relevant brand text for vector calculation
    const brandOwnership = Array.isArray(brand.ownership) ? brand.ownership : [];
    const brandCategories = Array.isArray(brand.categories) ? brand.categories : [];

    const words = cleanTextToWords([
      brand.name || "",
      ...brandOwnership,
      ...brandCategories
    ]);

    const vector = getAverageVector(words);

    if (!vector) continue;

    // Update the vector field for the brand in Supabase
    await supabase
    .from('brands')
    .update({ vector })
    .eq('id', brand.id);

    console.log(`Updated brand vector: ${brand.name}`);
  }
}

// Update product vectors in the database, merging with brand vectors if available
async function updateProductVectors() {
  const { data: products, error: productsError } = await supabase.from('products').select('*');
  if (productsError) throw productsError;

  for (let product of products) {
    // Calculate product text vector from title and categories
    const brandVector = Array.isArray(product.brand_vector)
      ? product.brand_vector
      : product.brand_vector
      ? JSON.parse(product.brand_vector)
      : [];

    const productCategories = Array.isArray(product.brand_categories)
      ? product.brand_categories
      : [];

    const words = cleanTextToWords([
      product.title || "",
      ...productCategories
    ]);

    const productTextVector = getAverageVector(words);
    if (!productTextVector) continue;

    // Merge product text vector and brand vector by averaging
    let finalVector = productTextVector;
    if (brandVector.length === productTextVector.length) {
      finalVector = productTextVector.map((v, i) => (v + brandVector[i]) / 2);
    }


  // Update the vector field for the product in Supabase
  await supabase
  .from('products')
  .update({ vector: finalVector })
  console.log(`Updated product vector: ${product.title}`);
  }
}

// Run main and handle uncaught errors
main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
