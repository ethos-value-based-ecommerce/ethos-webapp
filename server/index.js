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

// Get all products from a few brands.
app.get('/products/all', async (req, res) => {
  try {

    // Limits the number of brands to process
  const limit = Math.min(parseInt(req.query.limit) || 10, 10); // 10 Brands

    // First, get brands from the brands table with limit
    const { data: brands, error } = await supabase
      .from('brands')
      .select('name, brand_name')
      .limit(limit);

    if (error || !brands || brands.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to load brands',
        error: error?.message,
      });
    }

    // Extract brand names for searching
    const brandNames = brands.map(b => b.brand_name || b.name);

    // Query SerpAPI once per brand, get up to 2 products each
    const allProducts = await Promise.all(
      brandNames.map(async (brand) => {
        try {
          const response = await axios.get('https://serpapi.com/search.json', {
            params: {
              engine: 'google_shopping',
              q: brand,
              api_key: process.env.SERP_API_KEY,
              num: 2,
            },
          });

          const products = response.data.shopping_results || [];
          // Add brand information to each product and limit to 2 products per brand
          return products.slice(0, 2).map(p => ({
            ...p,
            brand,
            image: p.thumbnail ||
                  (p.thumbnails && p.thumbnails.length > 0 ? p.thumbnails[0] : null) ||
                  (p.serpapi_thumbnails && p.serpapi_thumbnails.length > 0 ? p.serpapi_thumbnails[0] : null),
                }));
          }
        catch (err) {
          console.error(`Error fetching products for brand ${brand}:`, err.message);
          return [];
        }
      })
    );

    // Flatten results (array of arrays to single array)
    const flattenedProducts = allProducts.flat();

    res.json({
      success: true,
      data: flattenedProducts,
      brands_searched: brandNames,
      brands_processed: brandNames.length,
      total: flattenedProducts.length,
      message: `Processed ${brandNames.length} brands.`,
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

// Get product categories
app.get('/product/categories', async (req, res) => {
  try {
    // Get brand categories from the brand_category table
    const { data: productCategories, error } = await supabase
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
      data: productCategories,
      total: productCategories.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product categories',
      error: error.message
    })
  }
})

// Search products with query parameters - optimized into 1 API call and now working
app.get('/products/search', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required',
      });
    }

    // Use the exact brand name from database
    const { data: allBrands, error: brandsError } = await supabase
      .from('brands')
      .select('name, brand_name');

    if (brandsError || !allBrands || allBrands.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No brands found in database.',
        total: 0,
      });
    }

    const productLimit = Math.min(parseInt(limit) || 20, 50);

    // Search for products from each brand by calling the API
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        engine: 'google_shopping',
        q: query.trim(),
        api_key: process.env.SERP_API_KEY,
        num: 50,
      },
    });

    const products = response.data.shopping_results || [];

    // Normalize function (remove accents, lowercase)
    const normalize = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    // Create regex pattern using normalized brand_name
    const escapedBrands = allBrands
      .filter(b => b.brand_name)
      .map(b => normalize(b.brand_name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const brandPattern = new RegExp(`(${escapedBrands.join('|')})`, 'i');

    // Match products
    const matchedProducts = products
      .map(product => {
        const normalizedTitle = normalize(product.title || '');
        const normalizedSource = normalize(product.source || '');

        const match = brandPattern.exec(normalizedTitle) || brandPattern.exec(normalizedSource);

        if (match) {
          // Find the original brand record using the normalized match
          const matchedBrand = allBrands.find(({ brand_name }) =>
            normalize(brand_name) === match[1].toLowerCase()
          );

          return {
            ...product,
            brand: matchedBrand ? matchedBrand.name : match[1],
            image:
             product.thumbnail ||
            (product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : null) ||
            (product.serpapi_thumbnails && product.serpapi_thumbnails.length > 0 ? product.serpapi_thumbnails[0] : null),
          };
        }

        return null;
      })
      .filter(Boolean);

    res.json({
      success: true,
      data: matchedProducts.slice(0, productLimit),
      query,
      brand:'',
      brands_searched: allBrands.map(b => b.name),
      total: matchedProducts.length,
      message: `Searched '${query}' and returned products matching ${matchedProducts.length} of ${allBrands.length} known brands.`,
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

app.use('/recommendations', recommendationsRouter);




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
