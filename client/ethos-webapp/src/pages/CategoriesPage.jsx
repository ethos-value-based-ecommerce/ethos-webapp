import { useState } from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import '../App.css';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

const CategoriesPage = ({ categoryData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categoryData);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredCategories(categoryData);
    } else {
      const filtered = categoryData.filter(category =>
        category.name.toLowerCase().includes(value.toLowerCase()) ||
        category.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
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
        {/* Header Section */}
        <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <Title level={1}>Categories</Title>
          <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
            Explore our diverse range of ethical and sustainable categories. Each category represents brands
            committed to making a positive impact on people, planet, and communities.
          </Paragraph>
        </section>

        {/* Search Section */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Row justify="center">
            <Col xs={24} sm={16} md={12} lg={8}>
              <Input
                placeholder="Search categories..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                style={{ borderRadius: '8px' }}
              />
            </Col>
          </Row>
        </section>

        {/* Categories Grid */}
        <section>
          <Row gutter={[24, 24]} justify="center">
            {filteredCategories.map((category, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  hoverable
                  style={{
                    height: '100%',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' } }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                      {category.icon}
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      {category.name}
                    </Title>
                  </div>

                  <Paragraph
                    style={{
                      flex: 1,
                      color: '#666',
                      lineHeight: '1.6',
                      textAlign: 'center'
                    }}
                  >
                    {category.description}
                  </Paragraph>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Tag
                      color={category.color}
                      style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '16px'
                      }}
                    >
                      {category.name}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredCategories.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Title level={4} style={{ color: '#999' }}>
                No categories found matching "{searchTerm}"
              </Title>
              <Paragraph style={{ color: '#666' }}>
                Try searching with different keywords or browse all categories.
              </Paragraph>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section style={{ marginTop: '4rem', textAlign: 'center', background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
          <Row gutter={[32, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                {categoryData.length}
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                Categories Available
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={2} style={{ color: '#52c41a', margin: 0 }}>
                100+
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                Ethical Brands
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={2} style={{ color: '#fa8c16', margin: 0 }}>
                500+
              </Title>
              <Paragraph style={{ margin: 0, color: '#666' }}>
                Sustainable Products
              </Paragraph>
            </Col>
          </Row>
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default CategoriesPage;
