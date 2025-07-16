import React from "react";
import { Row, Col, Typography } from "antd";
import BrandCard from "../components/BrandCard.jsx";
import ProductCard from "../components/ProductCard.jsx";

const { Title } = Typography;

// Function to render the Feed Page with the reccomendation system.
// TO DO: Implement the reccomendation system in this page.
const FeedPage = () => {
 

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Brands Recommended for You</Title>
      <Row gutter={[16, 16]}>
        {brands.map((brand) => (
          <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
            <BrandCard brand={brand} />
          </Col>
        ))}
      </Row>

      <Title level={2} style={{ marginTop: "2rem" }}>
        Products You Might Like
      </Title>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
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
    </div>
  );
};

export default FeedPage;
