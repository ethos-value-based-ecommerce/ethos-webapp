import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Layout, Typography, Button, Row, Col, Tag, Spin, Alert, Modal } from 'antd';
import '../App.css';
import '../styling/HomePage.css';

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

  const handleQuizSubmit = (answers, justCompleted = false) => {
    console.log('Quiz answers:', answers);
    // Save quiz completion status to localStorage
    localStorage.setItem('quizCompleted', 'true');
    setQuizCompleted(true);
    // Navigate to the feed page with quiz answers and justCompletedQuiz flag
    navigate('/feed', {
      state: {
        quizAnswers: answers,
        justCompletedQuiz: justCompleted
      }
    });
  };

  const handleViewRecommendations = () => {
    // Get stored preferences from localStorage
    const storedPreferences = localStorage.getItem('quizPreferences');

    if (storedPreferences) {
      try {
        // Parse the stored preferences
        const preferences = JSON.parse(storedPreferences);

        // Navigate to feed page with the stored preferences
        navigate('/feed', {
          state: {
            quizAnswers: {
              ownership: preferences.ownership || [],
              productCategory: preferences.categories || [],
              socialResponsibility: preferences.socialResponsibility || "no",
              ethicalPractices: preferences.ethics || [],
              environmentalPractices: preferences.environmentalPractices || []
            }
          }
        });
      } catch (error) {
        console.error("Error parsing stored preferences:", error);
        navigate('/feed'); // Fallback to simple navigation
      }
    } else {
      // If no stored preferences, just navigate to feed page
      navigate('/feed');
    }
  };

  if (loading) {
    return (
      <Layout className="home-layout">
        <Header className="home-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="home-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="home-content-centered">
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className="home-layout">
        <Header className="home-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="home-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="home-content">
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
    <Layout className="home-layout">
      <Header className="home-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <Title level={2} className="home-title">ETHOS</Title>
            </Link>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content className="home-content">
        {/* Hero Section */}
        <section className="hero-section">
          <Title level={1} className="hero-title">Discover Brands That Share Your Values</Title>
          <Paragraph className="hero-description">
            Connect with ethical companies making a positive impact on the world.
            Find products that align with what matters most to you.
          </Paragraph>

          {user ? (
            // User is logged in
            quizCompleted ? (
              // User has completed the quiz
              <Button type="primary" size="large" className="hero-button" onClick={handleViewRecommendations}>
                View Your Recommendations
              </Button>
            ) : (
              // User is logged in but hasn't taken the quiz
              <Button type="primary" size="large" className="hero-button" onClick={handleOpenQuizModal}>
                Take the Values Quiz
              </Button>
            )
          ) : (
            // User is not logged in
            <Button type="primary" size="large" className="hero-button" onClick={handleOpenQuizModal}>
              Take the Values Quiz
            </Button>
          )}
        </section>

        {/* Value Propositions */}
        <section className="home-section">
          <div className="value-props">
            <div className="value-prop-card">
              <div className="value-prop-icon">✓</div>
              <Title level={4}>Ethical Sourcing</Title>
              <Paragraph>Discover brands committed to responsible sourcing and fair labor practices.</Paragraph>
            </div>
            <div className="value-prop-card">
              <div className="value-prop-icon">♻️</div>
              <Title level={4}>Sustainability</Title>
              <Paragraph>Support companies reducing environmental impact through innovative practices.</Paragraph>
            </div>
            <div className="value-prop-card">
              <div className="value-prop-icon">❤️</div>
              <Title level={4}>Social Impact</Title>
              <Paragraph>Find brands that give back to communities and support important causes.</Paragraph>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="home-section">
          <Title level={2} className="section-title">Browse by Category</Title>
          <div className="categories-container">
            <div className="categories-scroll">
              {/* Original categories */}
              {categories.map((category, index) => {
                const color = getCachedCategoryColor(category);
                return (
                  <div
                    key={index}
                    className="category-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Tag
                      className="category-tag"
                      style={{
                        backgroundColor: `${color}20`,
                        border: `1px solid ${color}40`
                      }}
                    >
                      {category}
                    </Tag>
                  </div>
                );
              })}

              {/* Duplicated categories for infinite scroll effect */}
              {categories.map((category, index) => {
                const color = getCachedCategoryColor(category);
                return (
                  <div
                    key={`dup-${index}`}
                    className="category-item"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <Tag
                      className="category-tag"
                      style={{
                        backgroundColor: `${color}20`,
                        border: `1px solid ${color}40`
                      }}
                    >
                      {category}
                    </Tag>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search Call-to-Action Section */}
        <section className="cta-section">
          <Title level={3}>Ready to find your perfect ethical match?</Title>
          <Paragraph>
            Browse our curated collection of brands committed to making a difference.
          </Paragraph>
          <Link to="/search-brands">
            <Button type="primary" size="large" className="cta-button">
              Start Your Search Now
            </Button>
          </Link>
        </section>

        {/* Featured Brands Section */}
        <section className="home-section">
          <div className="featured-brands-header">
            <Title level={2} className="section-title">Featured Brands</Title>
            <Link to="/search-brands" className="view-all-link">
              View All →
            </Link>
          </div>
          <Row gutter={[24, 24]} justify="start">
            {brands.slice(0, 8).map((brand) => (
              <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
                <div className="featured-brand-card">
                  <Link to={`/brands/${brand.id}`}>
                    <BrandCard brand={brand} />
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </section>
        {/* Testimonials Section */}
        <section className="testimonials-section">
          <Title level={2} className="section-title-centered">What Our Users Say</Title>
          <Paragraph className="testimonial-quote">
            "ETHOS has completely changed how I shop. I've discovered amazing brands that align with my values, and I feel good knowing my purchases are making a positive impact."
          </Paragraph>
          <Paragraph className="testimonial-author">
            — Sarah K., ETHOS User
          </Paragraph>
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
        title={<div className="modal-title-centered">Login Required</div>}
        open={isLoginPromptOpen}
        onCancel={handleCloseLoginPrompt}
        footer={
          <div className="modal-footer-centered">
            <Button key="cancel" onClick={handleCloseLoginPrompt} className="modal-button-margin">
              Cancel
            </Button>
            <Button key="login" type="primary" onClick={handleGoToLogin}>
              Go to Login
            </Button>
          </div>
        }
        centered
      >
        <div className="modal-content-centered">
          <Title level={4} className="modal-title">Please log in to take the quiz</Title>
          <Paragraph className="modal-paragraph">
            You need to be logged in to take our values quiz and get personalized brand recommendations.
          </Paragraph>
        </div>
      </Modal>
    </Layout>
  );
};

export default HomePage;
