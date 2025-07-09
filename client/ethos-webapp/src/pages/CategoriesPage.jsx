import { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Tag, Input, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import { categoriesApi } from '../services/api.jsx';
import '../App.css';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await categoriesApi.getAll();
        setCategories(data);
        setFilteredCategories(data);
      } catch (err) {
        setError('Failed to load categories. Please try again later.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!categories || !Array.isArray(categories)) {
      setFilteredCategories([]);
      return;
    }

    if (!value.trim()) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category =>
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
                disabled={loading}
              />
            </Col>
          </Row>
        </section>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Spin size="large" />
            <Paragraph style={{ marginTop: '1rem', color: '#666' }}>
              Loading categories...
            </Paragraph>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ marginBottom: '2rem' }}>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
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
        )}

        {/* Stats Section */}
        {!loading && !error && (
        <section style={{ marginTop: '4rem', textAlign: 'center', background: '#f8f9fa', padding: '2rem', borderRadius: '12px' }}>
          <Row gutter={[32, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                {categories.length}
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
        )}
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default CategoriesPage;
