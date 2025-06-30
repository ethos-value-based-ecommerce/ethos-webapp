import React from 'react';
import { Link } from 'react-router-dom';
import {Layout, Typography, Button, Row, Col} from 'antd';
import '../App.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the home page, including the header, navigation bar, discover section, categories section, and featured section
const HomePage = ({ brands, categories }) => {
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
                <Button block>{category}</Button>
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
