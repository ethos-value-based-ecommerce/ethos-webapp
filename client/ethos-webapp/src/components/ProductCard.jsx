import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph, Link } = Typography;
const { Meta } = Card;


// Function to render the product card with product title, image, price, description, website
const ProductCard = ({ productTitle, productPrice, productWebsite, productImage, onClick }) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      cover={
        <div style={{
          width: '100%',
          height: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <img
            alt={productTitle}
            src={productImage || '/fallback.jpg'}
            onError={(e) => { e.target.onerror = null; e.target.src = '/fallback.jpg'; }}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      }
    >
      <Meta
        title={productTitle}
        description={
          <>
            <Paragraph
              style={{ marginBottom: 0 }}>
              {productPrice}
            </Paragraph>
            {productWebsite && (
              <Link
                href={productWebsite}
                target="_blank"
                rel="noopener noreferrer">
                Buy now
              </Link>
            )}
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
