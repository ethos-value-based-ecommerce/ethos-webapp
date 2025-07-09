const express = require('express')
const axios = require('axios')
const dotenv = require('dotenv')
const cors = require('cors')

const supabase = require('./supabaseClient.js')
dotenv.config();

// install express
const app = express()
const PORT = 3000

// Enable CORS for all routes
app.use(cors())

app.use(express.json())

// Parse URL-encoded request bodies for routes.
app.use(express.urlencoded({ extended: true }))

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
          image: p.thumbnail
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

// Get all products (to a point)
app.get('/products/all', async (req, res) => {
  try {

    // Limits the number of brands to process
    const limit = parseInt(req.query.limit) || 5

    // First, get brands from the brands table with limit
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('name')
      .limit(limit)

    if (brandsError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve brands',
        error: brandsError.message
      })
    }

    if (!brands || brands.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No brands found in database',
        total: 0
      })
    }

    // Extract brand names for searching
    const brandNames = brands.map(brand => brand.name)

    // Search for products for each brand with concurrent requests and timeout
    const allProducts = []
    const searchPromises = brandNames.map(async (brandName) => {
      try {
        const response = await axios.get('https://serpapi.com/search.json', {
          params: {
            engine: 'google_shopping',
            q: brandName,
            api_key: process.env.SERP_API_KEY
          },
        })

        const products = response.data.shopping_results || []

        // Add brand information to each product and limit to 10 products per brand
        const productsWithBrand = products.slice(0, 5).map(product => ({
          ...product,
          brand: brandName
        }))

        return productsWithBrand
      } catch (apiError) {
        console.error(`Error fetching products for brand ${brandName}:`, apiError.message)
        return [] // Return empty array if brand fails
      }
    })

    // Wait for all requests to complete
    const results = await Promise.allSettled(searchPromises)

    // Collect all successful results
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allProducts.push(...result.value)
      }
    })

    res.json({
      success: true,
      data: allProducts,
      brands_searched: brandNames,
      brands_processed: limit,
      total: allProducts.length,
      message: `Processed ${limit} brands.`
    })
  } catch (error) {
    console.error('Error retrieving all products:', error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve all products',
      error: error.message
    })
  }
})

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

// Search products with query parameters - limited to brands in database
app.get('/products/search', async (req, res) => {
  try {
    const { query, category, brand, limit = 20 } = req.query;

    // Get brands from database to limit search scope
    let brandsToSearch = [];

    if (brand) {
      // Validate brand parameter and get exact name from database
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('name')
        .ilike('name', brand)
        .single();

      if (brandError || !brandData) {
        return res.status(400).json({
          success: false,
          message: `Brand "${brand}" not found in database. Please use a brand that exists in our system.`,
        });
      }

      // Use the exact brand name from database
      brandsToSearch = [brandData.name];
    } else {
      const { data: allBrands, error: brandsError } = await supabase
        .from('brands')
        .select('name');

      if (brandsError) {
        return res.status(500).json({
          success: false,
          message: 'Failed to retrieve brands from database',
          error: brandsError.message,
        });
      }

      if (!allBrands || allBrands.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: 'No brands found in database',
          total: 0,
        });
      }

      brandsToSearch = allBrands.map((b) => b.name);
    }

    // Validate limit parameter
    const productLimit = Math.min(parseInt(limit) || 20, 50);

    // Search for products from each brand
    const allProducts = [];
    const searchPromises = brandsToSearch.map(async (brandName) => {

      try {
        // Build search query for this brand
        let searchQuery = brandName;
        if (query) {
          searchQuery += ` ${query}`;
        }
        if (category) {
          searchQuery += ` ${category}`;
        }

        const response = await axios.get('https://serpapi.com/search.json', {
          params: {
            engine: 'google_shopping',
            q: searchQuery.trim(),
            api_key: process.env.SERP_API_KEY,
            num: productLimit,
          },
        });

        const products = response.data.shopping_results || [];

        // Filter products to only include those with the brand name in the title
        // and if query is provided, also check that query terms are in the title
        const brandFilteredProducts = products.filter((product) => {
          const title = product.title?.toLowerCase() || '';
          const brandNameLower = brandName.toLowerCase();

          // Must contain brand name as a complete word
          const brandRegex = new RegExp(`\\b${brandNameLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (!brandRegex.test(title)) {
            return false;
          }

          // If query is provided, must also contain query terms as complete words
          if (query) {
            const queryLower = query.toLowerCase();
            const queryWords = queryLower.split(' ').filter(word => word.length > 0);

            // Check if all query words are present in the title as complete words
            const hasAllQueryWords = queryWords.every(word => {
              const wordRegex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
              return wordRegex.test(title);
            });
            if (!hasAllQueryWords) {
              return false;
            }
          }

          return true;
        });

        // Add brand information to each product
        return brandFilteredProducts.map((product) => ({
          ...product,
          brand: brandName,
        }));
      } catch (apiError) {
        console.error(`Error fetching products for brand ${brandName}:`, apiError.message);
        return [];
      }
    });

    // Wait for all brand searches to complete
    const results = await Promise.allSettled(searchPromises);

    // Collect all successful results
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value.length > 0) {
        allProducts.push(...result.value);
      }
    });

    // Filter products by category if specified (additional client-side filtering)
    let filteredProducts = allProducts;
    if (category) {
      filteredProducts = allProducts.filter((product) =>
        product.title?.toLowerCase().includes(category.toLowerCase()) ||
        product.source?.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Remove duplicates with enhanced logic for similar titles
    const uniqueProducts = [];
    const seenProducts = new Set();

    // Helper function to normalize titles for comparison
    const normalizeTitle = (title) => {
      if (!title) return '';
      return title
        .toLowerCase()
        .replace(/[+&\-_|]/g, ' ') // Replace common separators with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };

    filteredProducts.forEach((product) => {
      // Create a unique identifier for the product
      let uniqueId = '';
      let shouldAdd = true;

      // First try product_id
      if (product.product_id) {
        uniqueId = product.product_id;
      }
      // Then try product_link
      else if (product.product_link) {
        uniqueId = product.product_link;
      }
      // For title-based deduplication, use normalized title + brand
      else if (product.title && product.brand) {
        const normalizedTitle = normalizeTitle(product.title);
        const brandName = product.brand.toLowerCase();
        uniqueId = `${brandName}_${normalizedTitle}`;
      }
      // Fallback to original title + price
      else if (product.title) {
        uniqueId = `${product.title.toLowerCase()}_${product.extracted_price || product.price || ''}`;
      }
      // Last resort
      else {
        uniqueId = `${product.position}_${product.title || 'unknown'}`;
      }

      // Additional check for similar titles even with different product_ids
      if (product.title && product.brand) {
        const normalizedCurrentTitle = normalizeTitle(product.title);
        const currentBrand = product.brand.toLowerCase();

        // Check against existing products for similar titles
        for (const existingProduct of uniqueProducts) {
          if (existingProduct.brand && existingProduct.title) {
            const normalizedExistingTitle = normalizeTitle(existingProduct.title);
            const existingBrand = existingProduct.brand.toLowerCase();

            // If same brand and very similar titles, consider it a duplicate
            if (currentBrand === existingBrand && normalizedCurrentTitle === normalizedExistingTitle) {
              shouldAdd = false;
              break;
            }
          }
        }
      }

      if (shouldAdd && !seenProducts.has(uniqueId)) {
        seenProducts.add(uniqueId);
        uniqueProducts.push(product);
      }
    });

    // Limit final results
    const finalProducts = uniqueProducts.slice(0, productLimit);

    res.json({
      success: true,
      data: finalProducts,
      query: query || '',
      category: category || '',
      brand: brand || '',
      brands_searched: brandsToSearch,
      total: finalProducts.length,
      message: `Searched products from ${brandsToSearch.length} brand(s) in your database`,
    });
  } catch (error) {
    console.error('Error in product search:', error.message);
    if (error.response?.data) {
      console.log('Error response:', error.response.data);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
