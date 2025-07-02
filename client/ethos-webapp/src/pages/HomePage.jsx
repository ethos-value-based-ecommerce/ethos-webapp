import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Tag} from 'antd';
import '../App.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';

// Importing category color for tag colors
import { getCategoryColor } from '../components/categoryColors.jsx';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the home page, including the header, navigation bar, discover section, categories section, and featured section
const HomePage = ({ brands, categories }) => {

  // Function to handle category click and navigate to search-brands with filter
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate('/search-brands', { state: { selectedCategory: category } });
  };
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
        {/* Discover Section */}
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Title level={2}>Discover brands that match your values</Title>
          <Paragraph>
            Find brands and products that align with your values and support causes you care about.
          </Paragraph>
          <Link to="/search-brands">
            <Button type="primary" size="large">
              Start Your Search Now
            </Button>
          </Link>
        </section>

        {/* Categories Section */}
        <section style={{ marginBottom: '3rem' }}>
          <Title level={2}>Browse by Category</Title>
          <Row gutter={[16, 16]} justify="center">
            {categories.slice(0, 6).map((category, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <div
                  style={{
                    cursor: 'pointer',
                    padding: '12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    ':hover': {
                      borderColor: '#1890ff',
                      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)'
                    }
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  <Tag
                    color={getCategoryColor(category)}
                    style={{
                      fontSize: '14px',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      fontWeight: '500'
                    }}
                  >
                    {category}
                  </Tag>
                </div>
              </Col>
            ))}
          </Row>
        </section>

        {/* Featured Brands Section */}
        <section>
          <Title level={2}>Featured Brands</Title>
          <Row gutter={[16, 16]} justify="start">
            {brands.slice(0, 6).map((brand) => (
              <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
                <Link to={`/brands/${brand.id}`}>
                  <BrandCard brand={brand} />
                </Link>
              </Col>
            ))}
          </Row>
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default HomePage;
