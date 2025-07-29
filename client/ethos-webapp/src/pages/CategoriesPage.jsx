import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Typography, Row, Col, Card, Tag, Input, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import { categoriesApi } from '../services/api.jsx';
import '../App.css';
import '../styling/CategoriesPage.css';

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
    <Layout className="categories-layout">
      <Header className="categories-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <Title level={2} className="categories-title">ETHOS</Title>
            </Link>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content className="categories-content">
        {/* Header Section */}
        <section className="categories-intro">
          <Title level={1} className="categories-intro-title">Categories</Title>
          <Paragraph className="categories-intro-text">
            Explore our diverse range of ethical and sustainable categories. Each category represents brands
            committed to making a positive impact on people, planet, and communities.
          </Paragraph>
        </section>

        {/* Search Section */}
        <section className="categories-search">
          <Row justify="center">
            <Col xs={24} sm={16} md={12} lg={8}>
              <Input
                placeholder="Search categories..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                size="large"
                className="categories-search-input"
                disabled={loading}
              />
            </Col>
          </Row>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="categories-loading">
            <Spin size="large" />
            <Paragraph className="categories-loading-text">
              Loading categories...
            </Paragraph>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="categories-error">
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
                  className="categories-card"
                  styles={{
                    body: {
                      padding: '24px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }
                  }}
                >
                  <div className="categories-card-title-container">
                    <Title level={4} className="categories-card-title">
                      {category.name}
                    </Title>
                  </div>

                  <Paragraph className="categories-card-description">
                    {category.description}
                  </Paragraph>

                  <div className="categories-card-tag-container">
                    <Tag
                      color={category.color}
                      className="categories-card-tag"
                    >
                      {category.name}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredCategories.length === 0 && (
            <div className="categories-empty">
              <Title level={4} className="categories-empty-title">
                No categories found matching "{searchTerm}"
              </Title>
              <Paragraph className="categories-empty-text">
                Try searching with different keywords or browse all categories.
              </Paragraph>
            </div>
          )}
        </section>
        )}

        {/* Stats Section */}
        {!loading && !error && (
        <section className="categories-stats">
          <Row gutter={[32, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Title level={2} className="categories-stats-number">
                {categories.length}
              </Title>
              <Paragraph className="categories-stats-label">
                Categories Available
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={2} className="categories-stats-number">
                100+
              </Title>
              <Paragraph className="categories-stats-label">
                Ethical Brands
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={2} className="categories-stats-number">
                500+
              </Title>
              <Paragraph className="categories-stats-label">
                Sustainable Products
              </Paragraph>
            </Col>
          </Row>
        </section>
        )}
      </Content>

      <AntFooter className="categories-footer">
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default CategoriesPage;
