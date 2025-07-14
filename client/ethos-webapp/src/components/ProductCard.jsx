import React, { useState } from 'react';
import { Card, Typography, Button, Spin } from 'antd';
import FavoriteButton from './FavoriteButton.jsx';

const { Paragraph, Link } = Typography;
const { Meta } = Card;


// Function to render the product card with product title, image, price, description, website
const ProductCard = ({ productTitle, productPrice, productWebsite, productImage, onClick, showLink = false }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

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
          position: 'relative',
        }}>
          {imageLoading && productImage && (
            <Spin size="large" style={{ position: 'absolute', zIndex: 1 }} />
          )}
          <img
            alt={productTitle}
            src={imageError || !productImage ? '/fallback.jpg' : productImage}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              opacity: imageLoading && productImage ? 0.3 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
            }}
          >
            <FavoriteButton
              item={{
                id: productTitle, // Using productTitle as id since no id is passed
                name: productTitle,
                price: productPrice,
                image: productImage,
                website: productWebsite
              }}
              type="product"
              size="default"
            />
          </div>
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
            {productWebsite && showLink && (
              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <Button
                  href={productWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-now-button"
                  style={{
                    backgroundColor: '#000000',
                    borderColor: '#000000',
                    color: '#ffffff'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span style={{ color: '#ffffff' }}>Shop Now!</span>
                </Button>
              </div>
            )}
            {productWebsite && !showLink && (
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
