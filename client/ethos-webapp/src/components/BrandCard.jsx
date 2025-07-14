import React, { useEffect } from 'react';


import { Card, Typography, Button, Tag } from 'antd';

// Importing category color for tag colors
import { getCachedCategoryColor, preloadCategoryColors } from './categoryColors.jsx';
import FavoriteButton from './FavoriteButton.jsx';

const { Paragraph } = Typography;
const { Meta } = Card;


// Function to render the Brand Card with brand name, image, mission, description, website, and tags
// More responsiveness in the brand card functionality
const BrandCard = ({ brand, onTagClick }) => {
  // Load the category colors.
  useEffect(() => {
    preloadCategoryColors();
  }, []);

  if (!brand) {
    return null;
  }

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      cover={
        <div
          style={{
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            position: 'relative',
          }}
        >
          <img
            src={brand.image}
            alt={brand.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
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
              item={brand}
              type="brand"
              size="default"
            />
          </div>
        </div>
      }
    >
      <Meta
        title={brand.name}
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brand.mission && (
              <Paragraph style={{ margin: 0, fontStyle: 'italic' }}>
                {brand.mission}
              </Paragraph>
            )}

            {brand.description && (
              <Paragraph style={{ margin: 0 }}>
                {brand.description}
              </Paragraph>
            )}

            {brand.categories && brand.categories.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {brand.categories.map((tag, index) => {
                  const baseColor = getCachedCategoryColor(tag);
                  return (
                    <Tag
                      key={index}
                      onClick={() => onTagClick && onTagClick(tag)}
                      style={{
                        cursor: 'pointer',
                        marginBottom: '4px',
                        backgroundColor: `${baseColor}20`, // light pastel fill (12.5% opacity)
                        border: `1.5px solid ${baseColor}80`, // subtle border (~50% opacity)
                        color: baseColor,
                        fontWeight: '600',
                        borderRadius: '20px',
                        userSelect: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0 12px',
                      }}
                    >
                      {tag}
                    </Tag>
                  );
                })}
              </div>
            )}

            {brand.website && (
              <Button
                type="default"
                onClick={() => window.open(brand.website, '_blank')}
                style={{ marginTop: '8px' }}
              >
                Visit Website Now!
              </Button>
            )}
          </div>
        }
      />
    </Card>
  );
};

export default BrandCard;
