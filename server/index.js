const express = require('express')
const router = express.Router()
const supabase = require('./supabaseClient.js')

const app = express()
const PORT = 3000

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

// Get each brand's categories
app.get('/brands/categories', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')

    res.json({
      success: true,
      data: categories,
      total: categories.length
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

// Get all products
app.get('/products', async (req, res) => {
 try {
    // TOD0: Call the product search API.
    res.json({
      success: true,
      data: products,
      total: products.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: error.message
    })
  }
})

// Get product by ID
app.get('/products/:id', async (req, res) => {
 try {
  // TOD0: Call the product search API.

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: error.message
    })
  }
})

// Get product categories
app.get('/products/categories', async (req, res) => {
 try {
// TOD0: Call the product search API.
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

// Get product search with query
app.get('/products/search', async (req, res) => {
  try {
     // TOD0: Call the product search API.
    res.json({
      success: true,
      data: products,
      query: query || '',
      category: category || '',
      total: products.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search products',
      error: error.message
    })
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
