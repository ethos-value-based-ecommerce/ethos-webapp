import { useState, useEffect } from 'react';
import { Layout, Typography, Input, Button, Row, Col, Modal, Tag } from 'antd';

import NavBar from '../components/NavBar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Footer from '../components/Footer.jsx';

// Importing category color for tag colors
import { getCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Number of items to show per page (for right now, I'll just use 8)
const ItemsPerPage = 8;

const SearchProductsPage = ({ products, brands }) => {
  const [productSearch, setProductSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Initialize filtered products and categories when props change
  useEffect(() => {
    if (products && brands) {
      setFilteredProducts(products);

      // Extract unique categories from brands that have products
      const productBrandIds = [...new Set(products.map(p => p.brandId))];
      const relevantBrands = brands.filter(b => productBrandIds.includes(b.id));
      const categories = [...new Set(relevantBrands.flatMap(b => b.categories || []))];
      setAvailableCategories(categories);
    }
  }, [products, brands]);

  // Function to get brand categories for a product
  const getProductCategories = (product) => {
    if (!brands) return [];
    const brand = brands.find(b => b.id === product.brandId);
    return brand ? brand.categories || [] : [];
  };

  // Function to handle search
  const handleSearch = () => {
    if (!products || !brands) return;

    const lowerSearch = productSearch.toLowerCase().trim();
    const results = products.filter(product => {
      const matchesName = product.title.toLowerCase().includes(lowerSearch);
      const matchesDescription = product.description.toLowerCase().includes(lowerSearch);
      const productCategories = getProductCategories(product);
      const matchesCategory = productCategories.some(cat =>
        cat.toLowerCase().includes(lowerSearch)
      );

      return matchesName || matchesDescription || matchesCategory;
    });
    setFilteredProducts(results);
    setCurrentPage(1);
  };

  // Function to handle clearing search
  const handleClear = () => {
    setProductSearch('');
    setFilteredProducts(products || []);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // Function to handle category filtering
  const handleCategoryClick = (category) => {
    if (!products || !brands) return;

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
      setFilteredProducts(products);
    } else {
      const results = products.filter(product => {
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
          <Title level={3}>Filter by Category</Title>
          <div style={{ marginTop: '1rem' }}>
            {availableCategories.map((category, index) => (
              <Tag
                key={index}
                color={getCategoryColor(category)}
                style={{
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: selectedCategories.includes(category) ? 'bold' : 'normal',
                  border: selectedCategories.includes(category) ? '2px solid' : '1px solid transparent',
                  transform: selectedCategories.includes(category) ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Tag>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <section>
          <Title level={3}>Search Results</Title>
          {paginatedProducts.length > 0 ? (
            <>
              <Row gutter={[16, 16]} justify="space-around">
                {paginatedProducts.map(product => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                    <ProductCard
                      onClick={() => handleProductClick(product)}
                      productTitle={product.title}
                      productImage={product.image}
                      productPrice={product.price}
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
            <p>No products matching your search.</p>
          )}
        </section>
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
            productDescription={selectedProduct.description}
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
