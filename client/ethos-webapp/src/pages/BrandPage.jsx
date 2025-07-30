import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout, Typography, Row, Col, Spin, Alert, Button, Tag } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getCachedCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';
import '../styling/SearchProductsPage.css';
import '../styling/BrandPage.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';

import { brandsApi, productsApi } from '../services/api.jsx';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the individual brand pages with brand information and its product information
const BrandPage = () => {
  const { id } = useParams();
  const brandId = parseInt(id, 10);
  const navigate = useNavigate();

  const [brand, setBrand] = useState(null);
  const [brandProducts, setBrandProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const brandsData = await brandsApi.getAll();
        const foundBrand = brandsData.find(b => b.id === brandId);

        if (!foundBrand) {
          throw new Error('Brand not found');
        }

        setBrand(foundBrand);

        const productsData = await productsApi.getByBrand(foundBrand.name);
        setBrandProducts(productsData);
      } catch (err) {
        console.error('Fetch failed:', err);
        setError(err.message || 'Failed to load brand page');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandId]);

  const handleProductClick = product => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  if (loading) {
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
        <Content className="loading-container">
          <Spin indicator={<LoadingOutlined className="loading-icon" spin />} />
        </Content>
      </Layout>
    );
  }

  if (error || !brand) {
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
          <Alert message="Error" description={error} type="error" showIcon className="error-alert" />
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
        <div className="back-button-container">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="back-button"
            onClick={() => navigate('/search-brands')}
          >
            Back to Search
          </Button>
        </div>

        <section className="brand-hero-section">
          <Row justify="center">
            <Col xs={24} sm={22} md={20} lg={16}>
              <div className="brand-card-wrapper">
                <div className="brand-info-box">
                  <BrandCard brand={brand} />

                  {/* Category Tags based on qualities_vector */}
                  {brand.qualities_vector && brand.qualities_vector.length > 0 && (
                    <div style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-color)',
                      textAlign: 'center'
                    }}>
                      <Paragraph strong style={{ marginBottom: '12px', textAlign: 'center' }}>
                        Brand Categories
                      </Paragraph>
                      <div className="brand-categories-container" style={{ justifyContent: 'center' }}>
                      {/* Map qualities to category names */}
                      {(() => {
                        // Define quality categories based on the qualities_vector positions
                        const qualityCategories = [
                          "Black-Owned", "Asian-Owned", "Latin-Owned", "Indigenous-Owned", "Lgbtq-Owned",
                          "Disability-Owned", "Women-Founded", "Minority-Founded", "Underrepresented-Group-Founded",
                          "Beauty", "Clothing", "Footwear", "Handbags", "Personal-Care", "Outdoor-Gear",
                          "Home-Decor", "Electronics", "Vegan", "Cruelty-Free", "Sustainable", "Eco-Conscious",
                          "Fair-Trade", "Social-Responsibility", "Zero-Waste", "Carbon-Neutral", "Clean-Ingredients"
                        ];

                        // Filter qualities that are marked as 1 in the vector
                        const brandQualities = brand.qualities_vector
                          .map((value, index) => value === 1 ? qualityCategories[index] : null)
                          .filter(quality => quality !== null);

                        // Return the tags
                        return brandQualities.map((quality, index) => {
                          const color = getCachedCategoryColor(quality);
                          return (
                            <Tag
                              key={index}
                              className="category-tag"
                              style={{
                                backgroundColor: `${color}20`,
                                border: `1px solid ${color}40`,
                                color: '#333',
                                margin: '0 8px 8px 0'
                              }}
                            >
                              {quality}
                            </Tag>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <section className="results-section" style={{ marginTop: '60px' }}>
          <Row justify="space-between" align="middle" className="results-header">
            <Col>
              <Title level={3} className="results-title">Products</Title>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {brandProducts.map((product, index) => (
              <Col xs={24} sm={12} md={8} lg={6}
                key={product.id || `${product.title}-${index}`}>
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
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

      <ProductModal isOpen={!!selectedProduct} onClose={closeModal} title={selectedProduct?.title || "Product Details"}>
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
                <Paragraph strong>{selectedProduct.price}</Paragraph>

                {selectedProduct.description && (
                  <Paragraph>{selectedProduct.description}</Paragraph>
                )}

                {/* Category Tags based on qualities_vector */}
                {selectedProduct.qualities_vector && (
                  <div className="product-categories">
                    <Paragraph strong style={{ marginBottom: '8px' }}>Categories:</Paragraph>
                    <div className="tags-container">
                      {selectedProduct.qualities_vector.split(',').map((quality, index) => {
                        const trimmedQuality = quality.trim();
                        if (!trimmedQuality) return null;

                        const tagColor = getCachedCategoryColor(trimmedQuality) || '#d9d9d9';

                        return (
                          <Tag
                            key={index}
                            className="category-tag"
                            style={{
                              backgroundColor: `${tagColor}20`,
                              border: `1px solid ${tagColor}40`,
                              color: '#333',
                              margin: '0 8px 8px 0'
                            }}
                          >
                            {trimmedQuality}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedProduct.website && (
                  <Button
                    href={selectedProduct.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shop-now-button"
                    style={{
                      marginTop: '16px',
                      backgroundColor: 'var(--button-background, #A58A89)',
                      borderColor: 'var(--button-background, #A58A89)',
                      color: 'white',
                      borderRadius: '30px',
                      padding: '6px 16px',
                      height: 'auto',
                      fontWeight: 600,
                      transition: 'all 0.3s ease'
                    }}
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

export default BrandPage;
