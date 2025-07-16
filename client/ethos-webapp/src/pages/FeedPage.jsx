import { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Spin, Alert } from "antd";
import { useLocation, Link } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import NavBar from "../components/NavBar.jsx";
import BrandCard from "../components/BrandCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Footer from "../components/Footer.jsx";
import { brandsApi, productsApi } from "../services/api.jsx";
import "../App.css";

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
  const location = useLocation();
  const quizAnswers = location.state?.quizAnswers;

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        // Fetch all brands
        const allBrands = await brandsApi.getAll();

        // For now, just getting first 5
        const topBrands = allBrands.slice(0, 5);
        setRecommendedBrands(topBrands);

        // Fetch all products (limited to 10)
        const products = await productsApi.getAll(10);
        setAllProducts(products);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError(ERROR_MESSAGE);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [quizAnswers]);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#fff", padding: "0 2rem" }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3} style={{ margin: 0, color: "#000" }}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginLeft: "1rem" }}>{LOADING_MESSAGE}</p>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#fff", padding: "0 2rem" }}>
          <Row justify="space-between" align="middle">
            <Col><Title level={3} style={{ margin: 0, color: "#000" }}>ETHOS</Title></Col>
            <Col><NavBar /></Col>
          </Row>
        </Header>
        <Content style={{ padding: "2rem" }}>
          <Alert
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
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 2rem" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: "#000" }}>ETHOS</Title>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "2rem" }}>
        {/* Page Header */}
        <section style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Title level={2}>{PAGE_TITLE}</Title>
          <Paragraph>
            {PAGE_SUBTITLE}
          </Paragraph>
        </section>

        {/* Brands Section */}
        <section style={{ marginBottom: "3rem" }}>
          <Title level={3}>{BRANDS_TITLE}</Title>
          <Row gutter={[16, 16]} justify="start">
            {recommendedBrands.map((brand) => (
              <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
                <Link to={`/brands/${brand.id}`} style={{ textDecoration: "none" }}>
                  <BrandCard brand={brand} />
                </Link>
              </Col>
            ))}
          </Row>
        </section>

        {/* Products Section */}
        <section>
          <Title level={3}>{PRODUCTS_TITLE}</Title>
          <Row gutter={[16, 16]} justify="start">
            {allProducts.map((product, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={`product-${index}`}>
                <ProductCard
                  productTitle={product.name}
                  productPrice={product.price}
                  productWebsite={product.website}
                  productImage={product.image}
                  productData={product}
                  showLink
                />
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

export default FeedPage;
