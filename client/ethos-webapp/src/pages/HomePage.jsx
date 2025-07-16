import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Tag, Spin, Alert, Modal } from 'antd';
import '../App.css';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import QuizModal from '../components/QuizModal.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.jsx';

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
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Get authentication context
  const { user } = useAuth();

  // Function to handle category click and navigate to search-brands with filter
  const navigate = useNavigate();

  // Check if quiz has been completed
  useEffect(() => {
    const quizStatus = localStorage.getItem('quizCompleted');
    if (quizStatus === 'true') {
      setQuizCompleted(true);
    }
  }, []);

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

  const handleOpenQuizModal = () => {
    if (user) {
      // User is logged in, open the quiz modal
      setIsQuizModalOpen(true);
    } else {
      // User is not logged in, show login prompt
      setIsLoginPromptOpen(true);
    }
  };

  const handleCloseQuizModal = () => {
    setIsQuizModalOpen(false);
  };

  const handleCloseLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  const handleGoToLogin = () => {
    setIsLoginPromptOpen(false);
    navigate('/login');
  };

  const handleQuizSubmit = (answers) => {
    console.log('Quiz answers:', answers);
    // Save quiz completion status to localStorage
    localStorage.setItem('quizCompleted', 'true');
    setQuizCompleted(true);
    // Navigate to the feed page with quiz answers
    navigate('/feed', { state: { quizAnswers: answers } });
  };

  const handleViewRecommendations = () => {
    navigate('/feed');
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
        {/* Discover Section */}
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Title level={2}>Discover brands that match your values</Title>
          <Paragraph>
            Find brands and products that align with your values and support causes you care about.
          </Paragraph>

          {quizCompleted ? (
            <>
              <Paragraph style={{ color: '#52c41a', fontWeight: 'bold', marginBottom: '16px' }}>
                You've already completed the values quiz!
              </Paragraph>
              <Button type="primary" size="large" onClick={handleViewRecommendations}>
                View Recommendations
              </Button>
            </>
          ) : (
            <Button type="primary" size="large" onClick={handleOpenQuizModal}>
              Take Values Quiz
            </Button>
          )}
        </section>

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

        {/* Search Call-to-Action Section */}
        <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link to="/search-brands">
            <Button type="default" size="large">
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

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={handleCloseQuizModal}
        onSubmit={handleQuizSubmit}
      />

      <Modal
        title={<div style={{ textAlign: 'center' }}>Login Required</div>}
        open={isLoginPromptOpen}
        onCancel={handleCloseLoginPrompt}
        footer={
          <div style={{ textAlign: 'center' }}>
            <Button key="cancel" onClick={handleCloseLoginPrompt} style={{ marginRight: '8px' }}>
              Cancel
            </Button>
            <Button key="login" type="primary" onClick={handleGoToLogin}>
              Go to Login
            </Button>
          </div>
        }
        centered
      >
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>Please log in to take the quiz</Title>
          <Paragraph style={{ marginBottom: 0, fontSize: '16px' }}>
            You need to be logged in to take our values quiz and get personalized brand recommendations.
          </Paragraph>
        </div>
      </Modal>
    </Layout>
  );
};

export default HomePage;
