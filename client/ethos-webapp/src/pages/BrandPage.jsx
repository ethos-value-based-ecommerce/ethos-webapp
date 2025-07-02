import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Row, Col} from 'antd';
import '../App.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the individual brand pages with brand infomration and it's product information
const BrandPage = ({brands, products}) => {
  const { id } = useParams();
  const brandId = parseInt( id );
  const brand = brands.find((b) => b.id === brandId);
  const brandProducts = products.filter((p) => p.brandId === brandId);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleProductClick = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  return (
    <Layout style={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: 'none',
      margin: 0,
      padding: 0
    }}>
      <Header style={{ background: '#fff', padding: '0 2rem', width: '100%' }}>
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
          {brandProducts.map((product) => (
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
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>

      <ProductModal isOpen={!!selectedProduct} onClose={closeModal}>
        {selectedProduct && (
          <ProductCard
            key={selectedProduct.id}
            productImage={selectedProduct.image}
            productTitle={selectedProduct.title}
            productPrice={selectedProduct.price}
            productDescription={selectedProduct.description}
            productWebsite={selectedProduct.website}
            productLinkText={selectedProduct.linkText}
            alt={selectedProduct.alt}
          />
        )}
      </ProductModal>
    </Layout>
  );
};

export default BrandPage;
