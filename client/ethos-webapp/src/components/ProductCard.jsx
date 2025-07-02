import React from 'react';
import { Card, Button } from 'antd';

const { Meta } = Card;

// Function to render the product card with product title, image, price, description, website
const ProductCard = ({ productImage, productTitle, productPrice, productDescription, productWebsite, alt, onClick, showLink = true }) => {
  return (
    <Card
      hoverable
      cover={<img alt={alt || productTitle} src={productImage} />}
      onClick={onClick}
      style={{ width: 300 }}
    >
      <Meta
        title={productTitle}
        description={
          <>
            <p style={{ fontWeight: 'bold', marginBottom: 8 }}>{productPrice}</p>
            <p>{productDescription}</p>
            {showLink && productWebsite && (
              <Button
                type="primary"
                href={productWebsite}
                target="_blank"
              >
                Shop Now
              </Button>
            )}
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
