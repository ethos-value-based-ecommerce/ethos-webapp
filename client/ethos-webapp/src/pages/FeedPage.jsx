import { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Spin, Alert, Empty } from "antd";
import { useLocation, Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import NavBar from "../components/NavBar.jsx";
import BrandCard from "../components/BrandCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";
import { recommendationsApi } from "../services/api.jsx";
import "../App.css";
import "../styling/FeedPage.css";

// Magic strings as constants for easy changes later
const BRANDS_TITLE = "Brands Recommended for You";
const PRODUCTS_TITLE = "Products You Might Like";
const PAGE_TITLE = "Your Personalized Recommendations";
const PAGE_SUBTITLE = "Based on your preferences, we've selected these brands and products for you.";
const LOADING_MESSAGE = "Loading your personalized recommendations...";
const ERROR_MESSAGE = "Failed to load recommendations. Please try again later.";

const { Title, Paragraph } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;

// Function to render the Feed Page with the recommendation system.
// TO DO: Implement the reccomendation system in this page.
const FeedPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendedBrands, setRecommendedBrands] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const location = useLocation();
  const quizAnswers = location.state?.quizAnswers;
  

  // DEMO MODE: Always show celebration animation when the page loads
  useEffect(() => {
    console.log("DEMO MODE: Always showing celebration animation");
    setShowCelebration(true);

    // Hide celebration after animation completes
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        // If we have quiz answers, use them to get personalized recommendations
        if (quizAnswers) {
          console.log("Fetching personalized recommendations with:", quizAnswers);

          // Format the preferences object to match what the backend expects
          const preferences = {
            ownership: quizAnswers.ownership || [],
            categories: quizAnswers.productCategory || [],
            socialResponsibility: quizAnswers.socialResponsibility || "no",
            ethics: quizAnswers.ethicalPractices || [],
            environmentalPractices: quizAnswers.environmentalPractices || []
          };

          // Get personalized recommendations
          const response = await recommendationsApi.get(preferences);

          console.log("Received recommendations:", response);

          // Extract recommendations from the response
          if (response.success && response.data) {
            // Server returns { success: true, data: { brands: [], products: [] } }
            setRecommendedBrands(response.data.brands || []);
            setAllProducts(response.data.products || []);
          } else if (response.brands && response.products) {
            // Direct response format { brands: [], products: [] }
            setRecommendedBrands(response.brands || []);
            setAllProducts(response.products || []);
          } else {
            console.error("Invalid response format:", response);
            setError("Received invalid response format from server");
          }
        } else {
          // If no quiz answers, check if we have stored preferences in localStorage
          const storedPreferences = localStorage.getItem('quizPreferences');

          if (storedPreferences) {
            const preferences = JSON.parse(storedPreferences);
            console.log("Using stored preferences:", preferences);

            // Get personalized recommendations using stored preferences
            const response = await recommendationsApi.get(preferences);

            console.log("Received recommendations from stored preferences:", response);

            // Extract recommendations from the response
            if (response.success && response.data) {
              // Server returns { success: true, data: { brands: [], products: [] } }
              setRecommendedBrands(response.data.brands || []);
              setAllProducts(response.data.products || []);
            } else if (response.brands && response.products) {
              // Direct response format { brands: [], products: [] }
              setRecommendedBrands(response.brands || []);
              setAllProducts(response.products || []);
            } else {
              console.error("Invalid response format:", response);
              setError("Received invalid response format from server");
            }
          } else {
            console.log("No preferences found, showing default recommendations");
            // No preferences available, show a message or default recommendations
            setError("No preference data found. Please take the quiz for personalized recommendations.");
          }
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [quizAnswers]);

  // Render enhanced celebration animation
  const renderConfetti = () => {
    if (!showCelebration) return null;

    // Create confetti elements with various shapes and colors
    const confettiElements = [];
    for (let i = 1; i <= 50; i++) {
      const size = Math.floor(Math.random() * 12) + 5; // Random size between 5-17px
      const type = i % 10 + 1; // Cycle through 10 different animation types
      const shapeType = i % 4; // 0: square, 1: circle, 2: triangle, 3: star
      const colorType = i % 6 + 1; // Cycle through 6 different colors

      let shapeClass = 'confetti-square';
      if (shapeType === 1) shapeClass = 'confetti-circle';
      else if (shapeType === 2) shapeClass = 'confetti-triangle';
      else if (shapeType === 3) shapeClass = 'confetti-star';

      let style = {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `-${size}px`,
      };

      confettiElements.push(
        <div
          key={`confetti-${i}`}
          className={`confetti confetti-${type} ${shapeClass} confetti-color-${colorType}`}
          style={style}
        />
      );
    }

    // Create sparkle elements
    const sparkleElements = [];
    for (let i = 1; i <= 12; i++) {
      sparkleElements.push(
        <div
          key={`sparkle-${i}`}
          className={`sparkle sparkle-${i % 6 + 1}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      );
    }

    return (
      <div className="celebration-container">
        {confettiElements}
        {sparkleElements}
        <div className="celebration-message">
          <h3>Congratulations!</h3>
          <p>Your personalized recommendations are ready!</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout className="feed-layout">
        <Header className="feed-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="home-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="feed-content">
          <div className="feed-loading">
            <Spin indicator={<LoadingOutlined className="feed-loading-icon" spin />} />
            <p className="feed-loading-text">{LOADING_MESSAGE}</p>

            {/* Animated loading placeholders */}
            <div className="loading-placeholder-container">
              {/* Brands section placeholder */}
              <div className="loading-section">
                <div className="loading-section-title"></div>
                <div className="loading-cards">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`brand-placeholder-${i}`}
                      className="loading-card"
                      style={{"--i": i}}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Products section placeholder */}
              <div className="loading-section">
                <div className="loading-section-title"></div>
                <div className="loading-cards">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={`product-placeholder-${i}`}
                      className="loading-card"
                      style={{"--i": i + 4}}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout className="feed-layout">
        <Header className="feed-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Link to="/">
                <Title level={2} className="home-title">ETHOS</Title>
              </Link>
            </Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content className="feed-content">
          <Alert
            className="feed-error"
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="feed-layout">
      {renderConfetti()}

      <Header className="feed-header">
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

      <Content className="feed-content">
        {/* Page Header */}
        <section>
          <Title level={2} className="feed-title">{PAGE_TITLE}</Title>
          <Paragraph className="feed-subtitle">
            {PAGE_SUBTITLE}
          </Paragraph>
        </section>

        {/* Brands Section */}
        <section className="feed-section feed-brands-section">
          <Title level={3} className="feed-section-title">{BRANDS_TITLE}</Title>
          {recommendedBrands.length > 0 ? (
            <Row gutter={[24, 24]} justify="start">
              {recommendedBrands.map((brand) => (
                <Col xs={24} sm={12} md={8} lg={6} key={brand.id} className="feed-card">
                  <Link to={`/brands/${brand.id}`} style={{ textDecoration: "none" }}>
                    <BrandCard brand={brand} />
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              className="feed-empty"
              description="No brand recommendations found based on your preferences"
            />
          )}
        </section>

        {/* Products Section */}
        <section className="feed-section feed-products-section">
          <Title level={3} className="feed-section-title">{PRODUCTS_TITLE}</Title>
          {allProducts.length > 0 ? (
            <Row gutter={[24, 24]} justify="start">
              {allProducts.map((product, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={`product-${index}`} className="feed-card">
                  <ProductCard
                    productTitle={product.title || product.name}
                    productPrice={product.price}
                    productWebsite={product.website}
                    productImage={product.image}
                    productData={product}
                    showLink
                  />
                </Col>
              ))}
            </Row>
          ) : (
            <Empty
              className="feed-empty"
              description="No product recommendations found based on your preferences"
            />
          )}
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default FeedPage;
