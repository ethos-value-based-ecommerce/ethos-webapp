import { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Typography, Input, Button, Row, Col, Modal, Tag, Spin, Alert, Empty } from 'antd';

import NavBar from '../components/NavBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Footer from '../components/Footer.jsx';
import { productsApi, categoriesApi } from '../services/api.jsx';

// Importing category color for tag colors
import { preloadCategoryColors, getCachedCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

const ItemsPerPage = 8;

const getTagStyle = (isSelected, tagColor) => ({
  backgroundColor: isSelected ? tagColor : `${tagColor}20`,
  border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
  color: isSelected ? '#000' : '#333',
  fontWeight: isSelected ? 'bold' : 'normal',
  marginBottom: '0.5rem',
  cursor: 'pointer',
  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  transition: 'all 0.2s ease',
  padding: '0.3rem 0.75rem',
  borderRadius: '24px'
});

const SearchProductsPage = () => {
  const [productSearch, setProductSearch] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandCategories, setBrandCategories] = useState([]);
  const [colorCacheReady, setColorCacheReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Map from brand name (lowercase) to array of categories for faster lookup
  const brandToCategories = useMemo(() => {
    const map = new Map();
    // Check if brandCategories is an array and has items
    if (!Array.isArray(brandCategories) || brandCategories.length === 0) {
      return map;
    }

    // Handle the new format where each item has name and brands properties
    if (brandCategories[0] && 'name' in brandCategories[0] && 'brands' in brandCategories[0]) {
      // New format: [{name: "category1", brands: ["brand1", "brand2"]}, ...]
      brandCategories.forEach(category => {
        if (!category || !category.name || !Array.isArray(category.brands)) return;

        const categoryName = category.name;

        category.brands.forEach(brandName => {
          if (!brandName) return;

          const key = brandName.toLowerCase();
          if (!map.has(key)) {
            map.set(key, []);
          }

          const brandCategories = map.get(key);
          if (!brandCategories.includes(categoryName)) {
            brandCategories.push(categoryName);
          }
        });
      });
    } else {
      brandCategories.forEach(item => {
        if (!item || !item.brand_name || !item.category_name) return;

        const key = item.brand_name.toLowerCase();
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(item.category_name);
      });
    }

    return map;
  }, [brandCategories]);

  // Initialize data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data
        const [productData, brandCategoriesData, categoriesData] = await Promise.all([
          productsApi.getAll(50),
          productsApi.getCategories(),
          categoriesApi.getAll(),
          preloadCategoryColors(),
        ]);

        setAllProducts(productData);
        setFilteredProducts(productData);
        setBrandCategories(brandCategoriesData);
        setCategories(categoriesData);

        setColorCacheReady(true);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to get brand categories for a product
  const getProductCategories = (product) => {
    // First check if product has brand_categories directly (from database)
    if (product?.brand_categories && Array.isArray(product.brand_categories)) {
      return product.brand_categories;
    }

    // Fall back to brand mapping if no direct categories
    const brandName = product?.brand_name || product?.brand;
    if (!brandName) return [];

    return brandToCategories.get(brandName.toLowerCase()) || [];
  };

  // Function to handle search
  const handleSearch = useCallback(async () => {
    const trimmedSearch = productSearch.trim();
    if (!trimmedSearch) {
      setFilteredProducts(allProducts);
      setCurrentPage(1);
      return;
    }

    try {
      setSearchLoading(true);
      const searchResults = await productsApi.search(trimmedSearch);
      setFilteredProducts(searchResults);
      setCurrentPage(1);
    } catch (err) {
      console.error('Search error:', err);
      const results = localSearch(trimmedSearch);
      setFilteredProducts(results);
      setCurrentPage(1);
    } finally {
      setSearchLoading(false);
    }
  }, [productSearch, allProducts]);


  const handleClear = () => {
    setProductSearch('');
    setFilteredProducts(allProducts);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

    // Function to handle category filtering
  const handleCategoryClick = (category) => {
    let newSelectedCategories;

    if (selectedCategories.includes(category)) {
      // Remove category if already selected
      newSelectedCategories = selectedCategories.filter(cat => cat !== category);
    } else {
      // Add category if not selected
      newSelectedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newSelectedCategories);

    // Filter products based on selected categories
    if (newSelectedCategories.length === 0) {
      setFilteredProducts(allProducts);
    } else {
      const results = allProducts.filter(product => {
        const productCategories = getProductCategories(product);
        return newSelectedCategories.every(selectedCat =>
          productCategories.some(cat =>
            cat.toLowerCase() === selectedCat.toLowerCase()
          )
        );
      });
      setFilteredProducts(results);
    }
    setCurrentPage(1);
  };

  // Function to handle product click
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // Function to close modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // Pagination
  const startIndex = (currentPage - 1) * ItemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ItemsPerPage);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 2rem' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '2rem' }}>
          {/* Search Header */}
             <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Title level={2}>Search Products</Title>
          <Row gutter={16} justify="center" style={{ marginTop: '1rem' }}>
            <Col xs={24} sm={16} md={12}>
              <Input
                placeholder="Search by name, description, or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
            <Col>
              <Button onClick={handleClear}>Clear</Button>
            </Col>
          </Row>
        </section>

        {/* Categories Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={3}>Filter by Categories</Title>
          <div style={{ marginTop: '1rem' }}>
            {categories.length > 0 && colorCacheReady ? (
              categories.map((category, index) => {
                const catName = typeof category === 'string' ? category : category.name;
                const isSelected = selectedCategories.includes(catName);
                const tagColor = (catName && typeof catName === 'string')
                  ? getCachedCategoryColor(catName) || '#d9d9d9'
                  : '#d9d9d9';

                return (
                  <Tag
                    key={category.id || index}
                    onClick={() => handleCategoryClick(catName)}
                    style={getTagStyle(isSelected, tagColor)}
                  >
                    {catName}
                  </Tag>
                );
              })
            ) : (
              <Spin size="small" />
            )}
          </div>

          {selectedCategories.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <Typography.Text strong>Selected filters: </Typography.Text>
              {selectedCategories.map((category, index) => {
                const tagColor = (category && typeof category === 'string')
                  ? getCachedCategoryColor(category) || '#d9d9d9'
                  : '#d9d9d9';
                return (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleCategoryClick(category)}
                    style={{
                      backgroundColor: tagColor,
                      border: `2px solid ${tagColor}`,
                      color: '#000',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      borderRadius: '24px',
                      padding: '0.3rem 0.75rem',
                    }}
                  >
                    {category}
                  </Tag>
                );
              })}
            </div>
          )}
        </section>

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spin size="large" />
            <p style={{ marginTop: '1rem' }}>Loading products...</p>
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '2rem' }}
          />
        )}

        {!loading && !error && (
          <section>
            <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
              <Col>
                <Title level={3}>
                  Search Results
                  {filteredProducts.length > 0 && (
                    <Typography.Text type="secondary" style={{ fontSize: '16px', fontWeight: 'normal' }}>
                      ({filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found)
                    </Typography.Text>
                  )}
                </Title>
              </Col>
              {searchLoading && (
                <Col>
                  <Spin size="small" />
                </Col>
              )}
            </Row>

            {filteredProducts.length > 0 ? (
              <>
                <Row gutter={[16, 16]} justify="space-around">
                  {paginatedProducts.map((product, index) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.id || `product-${index}`}>
                      <ProductCard
                        onClick={() => handleProductClick(product)}
                        productTitle={product.title}
                        productImage={product.image}
                        productPrice={product.price}
                        productWebsite={product.website}
                        showLink={true}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {filteredProducts.length > ItemsPerPage && (
                  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                      <Button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Previous
                      </Button>
                      <span style={{ padding: '0 16px', color: '#666' }}>
                        Page {currentPage} of {Math.ceil(filteredProducts.length / ItemsPerPage)}
                      </span>
                      <Button
                        disabled={currentPage >= Math.ceil(filteredProducts.length / ItemsPerPage)}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Empty
                description="No products matching your search."
                style={{ margin: '2rem 0' }}
              />
            )}
          </section>
        )}
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

        {/* Product Detail Modal */}
      <Modal
        title="Product Details"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        {selectedProduct && (
          <ProductCard
            productImage={selectedProduct.image}
            productTitle={selectedProduct.title}
            productPrice={selectedProduct.price}
            productWebsite={selectedProduct.website}
            alt={selectedProduct.alt}
            showLink={true}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default SearchProductsPage;
