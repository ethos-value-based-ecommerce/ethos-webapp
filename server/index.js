const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')

const supabase = require('./supabaseClient.js')
const { getRecommendations } = require('./utils/recommendations.js')
dotenv.config();

// install express
const app = express()
const PORT = 3000

// Enable CORS for all routes
app.use(cors())

app.use(express.json())

// Parse URL-encoded request bodies for routes.
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json())

// Import routes
const recommendationsRouter = require('./routes/recommendations.js');
const brandUploadRouter = require('./routes/brandUpload.js');

// Routes

// Home Route
app.get('/', async (req, res) => {
  try {
    res.send('Welcome to Ethos!')
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Get all brands
app.get('/brands', async (req, res) => {
  try {
    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brands',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: brands,
      total: brands.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve brands',
      error: error.message
    })
  }
})

// Get all brand categories
app.get('/brands/categories', async (req, res) => {
  try {
    // Get brand categories from the brand_category table
    const { data: brandCategories, error } = await supabase
      .from('brand_category')
      .select('brand_name, category_name')

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve product categories',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: brandCategories,
      total: brandCategories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve brand categories',
      error: error.message
    })
  }
})

// Get categories
app.get('/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message
    })
  }
})

// Get color for categories.
app.get('/categories/color', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name, color')

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category colors',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: categories,
      total: categories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category colors',
      error: error.message
    })
  }
})

// Get color for categories (plural endpoint for compatibility)
app.get('/categories/colors', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('name, color')

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category colors',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: categories,
      total: categories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve category colors',
      error: error.message
    })
  }
})

// Get categories for a specific brand
app.get('/brands/:id/categories', async (req, res) => {
  try {
    const brandId = req.params.id

    // Validate ID parameter
    if (!brandId || isNaN(parseInt(brandId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID provided'
      })
    }

    // First check if brand exists
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('name')
      .eq('id', brandId)
      .single()

    if (brandError) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      })
    }

    // Get categories for the specific brand
    const { data: brandCategories, error } = await supabase
      .from('brand_category')
      .select('category_name')
      .eq('brand_name', brand.name)

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brand categories',
        error: error.message
      })
    }

    res.json({
      success: true,
      brand_name: brand.name,
      data: brandCategories,
      total: brandCategories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve brand categories',
      error: error.message
    })
  }
})

// Search brands
app.get('/brands/search', async (req, res) => {
  try {
    const { query, category } = req.query

    let supabaseQuery = supabase.from('brands').select('*')

    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    const { data: brands, error } = await supabaseQuery

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to search brands',
        error: error.message
      })
    }

    res.json({
      success: true,
      data: brands,
      query: query || '',
      category: category || '',
      total: brands.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search brands',
      error: error.message
    })
  }
})

// Get brand by ID
app.get('/brands/:id', async (req, res) => {
  try {
    const brandId = req.params.id

    // Validate ID parameter
    if (!brandId || isNaN(parseInt(brandId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID provided'
      })
    }

    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .single()

    if (error) {
        return res.status(404).json({
          success: false,
          message: 'Brand not found'
        })
    }

    res.json({
      success: true,
      data: brand
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve brand',
      error: error.message
    })
  }
})

// Add a new brand
app.post('/brands', async (req, res) => {
  try {
    const { name, description, category, tags, website, logo } = req.body

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required'
      })
    }

    const { data: newBrand, error } = await supabase
      .from('brands')
      .insert([{
        name,
        description,
        category,
        tags,
        website,
        logo
      }])
      .select()
      .single()


    res.status(201).json({
      success: true,
      data: newBrand,
      message: 'Brand created successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
      error: error.message
    })
  }
})

// Edit/Update a brand
app.put('/brands/:id', async (req, res) => {
  try {
    const brandId = req.params.id
    const { name, description, category, tags, website, logo } = req.body

    // Validate ID parameter
    if (!brandId || isNaN(parseInt(brandId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID provided'
      })
    }

    // Check if brand exists
    const { data: existingBrand, error: selectError } = await supabase
      .from('brands')
      .select('id')
      .eq('id', brandId)
      .single()

    if (selectError) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      })

      throw selectError
    }

    // Update the brand
    const { data: updatedBrand, error: updateError } = await supabase
      .from('brands')
      .update({
        name,
        description,
        category,
        tags,
        website,
        logo
      })
      .eq('id', brandId)
      .select()
      .single()

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update brand',
        error: updateError.message
      })
    }

    res.json({
      success: true,
      data: updatedBrand,
      message: 'Brand updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update brand',
      error: error.message
    })
  }
})

// Get all products for a brand
app.get('/products', async (req, res) => {
  const { brand } = req.query;

  if (!brand) {
    return res.status(400).json({
      success: false,
      message: 'Missing brand query parameter',
    });
  }

  const normalize = (str) =>
    str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: brand,
        api_key: process.env.SERP_API_KEY,
      },
    });

    const normalizedBrand = normalize(brand);

    let products = (response.data.shopping_results || []).filter((p) => {
      const normalizedTitle = normalize(p.title);
      return normalizedTitle.includes(normalizedBrand);
    });

    // Deduplicate
    const seen = new Set();
    const filteredProducts = [];

    for (const p of products) {
      const key = p.title?.trim().toLowerCase();
      if (key && !seen.has(key)) {
        seen.add(key);
        filteredProducts.push({
          id: p.product_id || p.position || key,
          title: p.title,
          price: p.extracted_price ? `$${p.extracted_price.toFixed(2)}` : 'N/A',
          website: p.product_link,
          image: p.thumbnail || (p.thumbnails && p.thumbnails.length > 0 ? p.thumbnails[0] : null) || (p.serpapi_thumbnails && p.serpapi_thumbnails.length > 0 ? p.serpapi_thumbnails[0] : null)
        });
      }
    }

    res.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

// Get all products from the database
app.get('/products/all', async (req, res) => {
  try {
    // Fetch ALL products — no limit
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    res.json({
      success: true,
      data: products,
      total: products.length,
      message: `Retrieved ${products.length} product(s) from the database.`,
    });
  } catch (error) {
    console.error('Error retrieving all products:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all products',
      error: error.message,
    });
  }
});

// Get product categories based on products table
app.get('/product/categories', async (req, res) => {
  try {
    // Fetch brand_categories and brand_name from all products
    const { data: products, error } = await supabase
      .from('products')
      .select('brand_categories, brand_name');

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve product categories',
        error: error.message
      });
    }

    // Create a map of category to brands
    const categoryToBrands = new Map();

    // Process each product
    products.forEach(product => {
      const brandName = product.brand_name;
      const categories = product.brand_categories || [];

      if (brandName && categories.length > 0) {
        categories.forEach(category => {
          if (!category) return; // Skip null/undefined categories

          if (!categoryToBrands.has(category)) {
            categoryToBrands.set(category, new Set());
          }
          categoryToBrands.get(category).add(brandName);
        });
      }
    });

    // Convert the map to an array of objects with category and brands
    const categoriesWithBrands = Array.from(categoryToBrands.entries()).map(([category, brandsSet]) => ({
      name: category,
      brands: Array.from(brandsSet)
    }));

    res.json({
      success: true,
      data: categoriesWithBrands,
      total: categoriesWithBrands.length
    });
  } catch (error) {
    console.error('Error retrieving product categories:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product categories',
      error: error.message
    });
  }
});

// Search products with query parameters - now using Supabase instead of SerpAPI
app.get('/products/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    const productLimit = Math.min(parseInt(limit) || 20, 1000);

    // Query products table with case-insensitive partial match on title
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .ilike('title', `%${query}%`) // case-insensitive LIKE

    if (error) {
      throw new Error(error.message);
    }

    // Defensive: ensure products is an array
    const safeProducts = Array.isArray(products) ? products : [];

    res.json({
      success: true,
      data: safeProducts.slice(0, productLimit),
      query,
      total: safeProducts.length,
      message: `Found ${safeProducts.length} product(s) matching '${query}'.`,
    });
  } catch (error) {
    console.error('Error in product search:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message,
    });
  }
});

/*
  Explanation:
  I added this code to improve search reliability because SerpAPI (Google Shopping) only returns products that appear
  in its current search results, usually limited to the first page. For example, if I search for “indigenous makeup,”
  and a product from one of my brands doesn’t show up in the top results, SerpAPI would return nothing, even though the
  product exists. By storing products in my own database, I can return relevant products from known brands even when Google
  Shopping doesn’t immediately surface them.
*/

// Search and save products by brand
app.post('/products/save', async (req, res) => {
  try {
    const { brand } = req.body;

    if (!brand) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required in the request body',
      });
    }

    // First, search for products using SerpAPI
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: brand,
        api_key: process.env.SERP_API_KEY,
      },
    });

    // Normalize function (remove accents, lowercase)
    const normalize = (str) =>
      str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const normalizedBrand = normalize(brand);

    let products = (response.data.shopping_results || []).filter((p) => {
      const normalizedTitle = normalize(p.title);
      return normalizedTitle.includes(normalizedBrand);
    });

    // Get brand ID from database
    const { data: brandData, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .ilike('name', `%${brand}%`)
      .single();

    if (brandError) {
      console.error('Error finding brand:', brandError.message);
    }

    const brandId = brandData?.id || null;

    // Prepare products for insertion
    const productsToInsert = products.map(p => ({
      id: p.product_id || String(p.position),
      title: p.title,
      price: p.extracted_price ? `$${p.extracted_price.toFixed(2)}` : p.price || 'N/A',
      website: p.product_link || p.link,
      image: p.thumbnail ||
             (p.thumbnails && p.thumbnails.length > 0 ? p.thumbnails[0] : null) ||
             (p.serpapi_thumbnails && p.serpapi_thumbnails.length > 0 ? p.serpapi_thumbnails[0] : null),
      brand_name: brand,
      created_at: new Date().toISOString(),
      brand_vector: p.brand_vector || null,
      vector: p.vector || null,
      brand_categories: p.brand_categories || null,
      brand_id: brandId
    }));

    // Insert products into database
    const { data: savedProducts, error: insertError } = await supabase
      .from('products')
      .upsert(productsToInsert, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select();

    if (insertError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save products to database',
        error: insertError.message
      });
    }

    res.json({
      success: true,
      data: savedProducts || productsToInsert,
      total: productsToInsert.length,
      message: `Successfully saved ${productsToInsert.length} products for brand "${brand}" to database`
    });
  } catch (error) {
    console.error('Error in product search and save:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search and save products',
      error: error.message,
    });
  }
});


// Use recommendation router and brand-upload router.

app.use('/recommendations', recommendationsRouter);
app.use('/brand-upload', brandUploadRouter);




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
