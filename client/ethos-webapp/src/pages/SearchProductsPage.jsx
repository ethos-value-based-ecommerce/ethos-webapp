import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Input, Button, Row, Col, Tag, Spin, Alert, Empty } from 'antd';
import { SearchOutlined, ClearOutlined, LoadingOutlined } from '@ant-design/icons';

import NavBar from '../components/NavBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import Footer from '../components/Footer.jsx';
import { productsApi, categoriesApi } from '../services/api.jsx';

// Importing category color for tag colors
import { preloadCategoryColors, getCachedCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';
import '../styling/SearchProductsPage.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

const ItemsPerPage = 8;

// Function to handle the Search Products Page
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

  if (loading) {
    return (
      <Layout className="search-page-layout">
        <Header className="search-page-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className="search-page-title">ETHOS</Title>
            </Col>
            <Col>
              <NavBar />
            </Col>
          </Row>
        </Header>
        <Content className="loading-container">
          <Spin size="large" indicator={<LoadingOutlined className="loading-icon" spin />} />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="search-page-layout">
      <Header className="search-page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <Title level={3} className="search-page-title">ETHOS</Title>
            </Link>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content className="search-page-content">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="error-alert"
          />
        )}

        {/* Search Header */}
        <section className="search-section">
          <Title level={2} className="search-title">Search Products</Title>
          <Row gutter={16} justify="center" className="search-input-container">
            <Col xs={24} sm={16} md={12}>
              <Input
                placeholder="Search by name, description, or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                prefix={<SearchOutlined />}
                suffix={
                  searchLoading ? (
                    <LoadingOutlined spin />
                  ) : (
                    productSearch && (
                      <ClearOutlined
                        onClick={() => setProductSearch('')}
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  )
                }
                onPressEnter={handleSearch}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={searchLoading}
                onClick={handleSearch}
                className="search-button"
                disabled={!productSearch.trim() && selectedCategories.length === 0}
              >
                Search
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                className="clear-button"
                disabled={!productSearch && selectedCategories.length === 0}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </section>

        {/* Tags Section */}
        <section className="tags-section">
          <Title level={3} className="tags-title">Filter by Categories</Title>
          <div className="tags-container">
            <div className="categories-scroll">
              {categories.length > 0 && colorCacheReady ? (
                <>
                  {/* Original categories */}
                  {categories.map((category, index) => {
                    const catName = typeof category === 'string' ? category : category.name;
                    const isSelected = selectedCategories.includes(catName);
                    const tagColor = (catName && typeof catName === 'string')
                      ? getCachedCategoryColor(catName) || '#d9d9d9'
                      : '#d9d9d9';

                    return (
                      <div
                        key={index}
                        className="category-item"
                        onClick={() => handleCategoryClick(catName)}
                      >
                        <Tag
                          className={`category-tag ${isSelected ? 'category-tag-selected' : ''}`}
                          style={{
                            backgroundColor: isSelected ? tagColor : `${tagColor}20`,
                            border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
                            color: isSelected ? '#000' : '#333'
                          }}
                        >
                          {catName}
                        </Tag>
                      </div>
                    );
                  })}

                  {/* Duplicated categories for infinite scroll effect */}
                  {categories.map((category, index) => {
                    const catName = typeof category === 'string' ? category : category.name;
                    const isSelected = selectedCategories.includes(catName);
                    const tagColor = (catName && typeof catName === 'string')
                      ? getCachedCategoryColor(catName) || '#d9d9d9'
                      : '#d9d9d9';

                    return (
                      <div
                        key={`dup-${index}`}
                        className="category-item"
                        onClick={() => handleCategoryClick(catName)}
                      >
                        <Tag
                          className={`category-tag ${isSelected ? 'category-tag-selected' : ''}`}
                          style={{
                            backgroundColor: isSelected ? tagColor : `${tagColor}20`,
                            border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
                            color: isSelected ? '#000' : '#333'
                          }}
                        >
                          {catName}
                        </Tag>
                      </div>
                    );
                  })}
                </>
              ) : (
                <Spin size="small" />
              )}
            </div>
          </div>

          {/* Selected tags */}
          {selectedCategories.length > 0 && (
            <div className="selected-filters-container">
              <Typography.Text className="selected-filter-label">Selected filters: </Typography.Text>
              {selectedCategories.map((category, index) => {
                const tagColor = (category && typeof category === 'string')
                  ? getCachedCategoryColor(category) || '#d9d9d9'
                  : '#d9d9d9';
                return (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleCategoryClick(category)}
                    className="selected-tag"
                    style={{
                      backgroundColor: tagColor,
                      border: `2px solid ${tagColor}`,
                      color: '#000'
                    }}
                  >
                    {category}
                  </Tag>
                );
              })}
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="results-section">
          <Row justify="space-between" align="middle" className="results-header">
            <Col>
              <Title level={3} className="results-title">
                Search Results
                {filteredProducts.length > 0 && (
                  <Typography.Text type="secondary" className="results-count">
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
              <Row gutter={[16, 16]} justify="start">
                {paginatedProducts.map((product, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.id || `product-${index}`}>
                    <div className="product-card">
                      <ProductCard
                        onClick={() => handleProductClick(product)}
                        productTitle={product.title}
                        productImage={product.image}
                        productPrice={product.price}
                        productWebsite={product.website}
                        productData={product}
                        showLink={true}
                      />
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {filteredProducts.length > ItemsPerPage && (
                <div className="pagination-container">
                  <Button
                    className="pagination-button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="pagination-info">
                    Page {currentPage} of {Math.ceil(filteredProducts.length / ItemsPerPage)}
                  </span>
                  <Button
                    className="pagination-button"
                    disabled={currentPage >= Math.ceil(filteredProducts.length / ItemsPerPage)}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : !searchLoading ? (
            <Empty
              description={
                productSearch || selectedCategories.length > 0
                  ? "No products match your search criteria"
                  : "Start searching to discover ethical products"
              }
              className="empty-results"
            />
          ) : null}
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

      {/* Product Detail Modal */}
      <ProductModal
        isOpen={isModalVisible}
        onClose={handleModalClose}
        title={selectedProduct?.title || "Product Details"}
      >
        {selectedProduct && (
          <div style={{ padding: "20px" }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                <div style={{
                  width: '100%',
                  height: '300px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <img
                    src={selectedProduct.image || '/fallback.jpg'}
                    alt={selectedProduct.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </Col>
              <Col xs={24} md={12}>
                <Title level={4}>{selectedProduct.title}</Title>
                <Typography.Paragraph strong>{selectedProduct.price}</Typography.Paragraph>

                {selectedProduct.description && (
                  <Typography.Paragraph>{selectedProduct.description}</Typography.Paragraph>
                )}

                {selectedProduct.website && (
                  <Button
                    href={selectedProduct.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shop-now-button"
                    style={{ marginTop: '16px' }}
                  >
                    Shop Now
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        )}
      </ProductModal>
    </Layout>
  );
};

export default SearchProductsPage;
