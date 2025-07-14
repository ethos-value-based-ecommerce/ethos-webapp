import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Tag, Spin, Alert } from 'antd';
import '../App.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import QuizModalWrapper from '../components/QuizModalWrapper.jsx';
import api from '../services/api.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

// Importing category color for tag colors
import { preloadCategoryColors, getCachedCategoryColor } from '../components/categoryColors.jsx';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the home page, including the header, navigation bar, discover section, categories section, and featured section

const HomePage = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);

  // Function to handle category click and navigate to search-brands with filter
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [brandsData, categoriesData] = await Promise.all([
          api.brands.getAll(),
          api.categories.getAll(),
          preloadCategoryColors(), // Preload category colors here
        ]);

        setBrands(brandsData);
        const categoryNames = categoriesData.map(c => c.name || c.category_name);
        setCategories(categoryNames);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError(err.message || 'Failed to load data');
        setBrands([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user should see quiz prompt - show to all users, but track completion for authenticated users
  useEffect(() => {
    if (user) {
      const hasCompletedQuiz = localStorage.getItem(`quiz_completed_${user.id}`);
      if (!hasCompletedQuiz) {
        setShowQuizPrompt(true);
      } else {
        setShowQuizPrompt(false);
      }
    } else {
      // Show quiz prompt to non-authenticated users too
      setShowQuizPrompt(true);
    }
  }, [user]);

  const handleQuizComplete = (quizAnswers) => {
    console.log('Quiz completed with answers:', quizAnswers);
    // Mark quiz as completed for this user
    if (user) {
      localStorage.setItem(`quiz_completed_${user.id}`, 'true');
    }
    setShowQuizPrompt(false);
  };

  const refetch = () => {
    setLoading(true);
    setError(null);
    setBrands([]);
    setCategories([]);
    preloadCategoryColors(); // Ensure cache is refreshed
  };

  const handleCategoryClick = (category) => {
    navigate('/search-brands', { state: { selectedCategory: category } });
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 2rem' }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 2rem' }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ padding: '2rem' }}>
          <Alert
            message="Error Loading Data"
            description={`Failed to load homepage data: ${error}`}
            type="error"
            showIcon
            action={<Button size="small" danger onClick={refetch}>Try Again</Button>}
          />
        </Content>
      </Layout>
    );
  }

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
        {/* Quiz Prompt Section */}
        {showQuizPrompt && (
          <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Title level={2}>Discover Your Values</Title>
            <Paragraph>
              Take a quiz to learn more about your values and discover brands that align with what matters most to you.
            </Paragraph>
            <QuizModalWrapper onQuizComplete={handleQuizComplete} />
          </section>
        )}

        {/* Categories Section */}
        <section style={{ marginBottom: '3rem' }}>
          <Title level={2}>Browse by Category</Title>
          <Row gutter={[16, 16]} justify="center">
            {categories.slice(0, 9).map((category, index) => {
              const color = getCachedCategoryColor(category);
              return (
                <Col xs={24} sm={12} md={8} key={index}>
                  <div
                    style={{
                      cursor: 'pointer',
                      padding: '12px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '8px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Tag
                      style={{
                        backgroundColor: `${color}20`,
                        border: `1px solid ${color}40`,
                        color: '#000',
                        fontSize: '14px',
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {category}
                    </Tag>
                  </div>
                </Col>
              );
            })}
          </Row>
        </section>

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

        {/* Featured Brands Section */}
        <section>
          <Title level={2}>Featured Brands</Title>
          <Row gutter={[16, 16]} justify="start">
            {brands.slice(0, 8).map((brand) => (
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
