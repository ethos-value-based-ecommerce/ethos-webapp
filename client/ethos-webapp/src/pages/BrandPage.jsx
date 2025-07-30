import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout, Typography, Row, Col, Spin, Alert, Tag, Button } from 'antd';
import { LoadingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getCachedCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';
import '../styling/BrandPage.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';

import { brandsApi, productsApi } from '../services/api.jsx';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the individual brand pages with brand infomration and it's product information
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
      <Layout className="brand-layout">
        <Header className="brand-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="brand-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="brand-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Content>
      </Layout>
    );
  }

  if (error || !brand) {
    return (
      <Layout className="brand-layout">
        <Header className="brand-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="brand-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="brand-content">
          <Alert message="Error" description={error} type="error" showIcon />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="brand-layout">
      <Header className="brand-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <Title level={2} className="brand-title">ETHOS</Title>
            </Link>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content className="brand-content">
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
                <BrandCard brand={brand} />

                {/* Category Tags based on qualities_vector */}
                {brand.qualities_vector && brand.qualities_vector.length > 0 && (
                  <div className="brand-categories-container">
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
                              border: `1px solid ${color}40`
                            }}
                          >
                            {quality}
                          </Tag>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </section>

        <section className="brand-section">
          <div className="section-title">
            <Title level={3}>Products</Title>
          </div>
          <div className="products-grid">
            {brandProducts.map((product, index) => (
              <div
                className="product-card"
                key={product.id || `${product.title}-${index}`}
                onClick={() => handleProductClick(product)}
              >
                <div className="product-image-container">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

      <ProductModal isOpen={!!selectedProduct} onClose={closeModal} title={selectedProduct?.title}>
        {selectedProduct && (
          <div className="modal-content-centered">
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="product-image"
                style={{ maxHeight: 300, marginBottom: 16 }}
              />
            )}
            <h3 className="product-title">{selectedProduct.title}</h3>
            <p className="product-price">{selectedProduct.price}</p>
            {selectedProduct.website && (
              <a
                href={selectedProduct.website}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
                style={{ display: 'inline-block', marginTop: 16 }}
              >
                Shop Now
              </a>
            )}
          </div>
        )}
      </ProductModal>

    </Layout>
  );
};

export default BrandPage;
