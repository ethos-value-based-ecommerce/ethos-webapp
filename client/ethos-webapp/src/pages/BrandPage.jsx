import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import '../App.css';

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
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 2rem' }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Content>
      </Layout>
    );
  }

  if (error || !brand) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 2rem' }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ padding: '2rem' }}>
          <Alert message="Error" description={error} type="error" showIcon />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
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

      <Content style={{ padding: '2rem', width: '100%' }}>
        <Row justify="center" style={{ marginBottom: '2rem' }}>
          <Col xs={24} sm={22} md={20} lg={16}>
            <BrandCard brand={brand} />
          </Col>
        </Row>

        <Title level={3}>Products</Title>
        <Row gutter={[16, 16]}>
          {brandProducts.map((product, index) => (
            <Col xs={24} sm={12} md={8} lg={6}
            key={product.id || `${product.title}-${index}`}>
            <ProductCard
              onClick={() => handleProductClick(product)}
              productTitle={product.title}
              productImage={product.image}
              productPrice={product.price}
            />
          </Col>
            ))}
          </Row>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

      <ProductModal isOpen={!!selectedProduct} onClose={closeModal} title={selectedProduct?.title}>
        {selectedProduct && (
          <div style={{ textAlign: 'center' }}>
            {selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{ maxWidth: '100%', maxHeight: 300, marginBottom: 16, borderRadius: 12 }}
              />
            )}
            <h3>{selectedProduct.title}</h3>
            <p style={{ fontWeight: 'bold', marginBottom: 8 }}>{selectedProduct.price}</p>
            {selectedProduct.website && (
              <a
                href={selectedProduct.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  backgroundColor: '#222',
                  color: '#f0f0f0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: 12,
                  transition: 'background-color 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#222'}
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
