
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');
const { loadGlove, getSentenceVector } = require('../utils/gloveLoader');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables! Check your .env file.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Main function to load word vectors and update brand and product vectors
async function main() {
  await loadGlove(path.resolve(__dirname, '../data/glove.6B.300d.txt'));

  // Fetch brands from the database
  const { data: brands, error: brandsError } = await supabase.from('brands').select('id, name');
  if (brandsError) throw brandsError;
  console.log(`Found ${brands.length} brands in the database.`);

  // Fetch products from the database
  const { data: products, error: productsError } = await supabase.from('products').select('*');
  if (productsError) throw productsError;
  console.log(`Found ${products.length} products in the database.`);

  if (products.length > 0) {
    console.log("Sample product:", JSON.stringify(products[0], null, 2));
    console.log("Product columns:", Object.keys(products[0]));

    // Count how many products already have vector fields
    const productsWithVector = products.filter(p => p.vector && p.vector.length > 0);
    console.log(`Products with vector field: ${productsWithVector.length} out of ${products.length}`);

    // Count how many products have a title field
    const productsWithTitle = products.filter(p => p.title);
    console.log(`Products with title field: ${productsWithTitle.length} out of ${products.length}`);

    if (productsWithTitle.length > 0) {
      console.log("Sample product titles:");
      productsWithTitle.slice(0, 5).forEach(p => console.log(`- ${p.title}`));
    }
  }

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
    const text = `${brand.name} ${brand.mission || ''} ${(brand.categories || []).join(' ')}`;
    const vector = getSentenceVector(text);
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
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) throw error;

  for (let product of products) {
    // Calculate product text vector from title and categories
    const textVector = getSentenceVector(
      `${product.title} ${(product.brand_categories || []).join(' ')}`
    );
    if (!textVector) continue;

    // Parse brand vector if it exists, handle different formats safely
    let brandVector = [];
    if (product.brand_vector) {
      try {
        brandVector = Array.isArray(product.brand_vector)
          ? product.brand_vector
          : JSON.parse(product.brand_vector);
      } catch {
        brandVector = [];
      }
    }

    // Merge product text vector and brand vector by averaging
    let finalVector = textVector;
    if (brandVector.length === textVector.length) {
      finalVector = textVector.map((v, i) => (v + brandVector[i]) / 2);
    }

    // Update the vector field for the product in Supabase
    await supabase
      .from('products')
      .update({ vector: finalVector })
      .eq('id', product.id);

    console.log(`Updated product vector: ${product.title}`);
  }
}

// Run main and handle uncaught errors
main().catch(error => {
  console.error("Error:", error);
  process.exit(1);
});
