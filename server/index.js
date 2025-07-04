const express = require('express')

const app = express()
const PORT = 3000

app.use(express.json())

// Parse URL-encoded request bodies for routes.
app.use(express.urlencoded({ extended: true }))

const { getBrandTags, getAllBrands, getBrandById, searchProducts, searchBrands, getBrandCategories, getAllProducts, getProductCategories, getProductById} = require('./placeholderData.js')

// Routes

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
    const brands = getAllBrands()
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
    const brandCategories = getBrandCategories()
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
    const tags = getBrandTags()
    res.json({
      success: true,
      data: tags
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve brand tags',
      error: error.message
    })
  }
})

// Search brands
app.get('/brands/search', async (req, res) => {
  try {
    const { query, category } = req.query
    const result = searchBrands(query, category)

    res.json({
      success: true,
      data: result.brands,
      query: result.query,
      category: result.category,
      total: result.total
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

    const brand = getBrandById(brandId)

    if (!brand) {
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

// Get all products
app.get('/products', async (req, res) => {
  try {
    const products = getAllProducts()
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
    const productId = req.params.id

    // Validate ID parameter
    if (!productId || isNaN(parseInt(productId))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID provided'
      })
    }

    const product = getProductById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

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
    const productCategories = getProductCategories()
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
    const { query, category } = req.query
    const result = searchProducts(query, category)

    res.json({
      success: true,
      data: result.products,
      query: result.query,
      category: result.category,
      total: result.total
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
