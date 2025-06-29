import React from 'react';
import ValuesTag from './ValuesTag.jsx';

import {Card, Button, Tag} from 'antd';
const { Meta } = Card;

// Function to render the Brand Card with brand name, image, mission, description, website, and tags
const BrandCard = ({brand, onTagClick}) => {
  return(
      <Card
        hoverable
        style={{width:300, margin:'1rem'}}
        cover={<img className='brand-card-image' alt={brand.alt} src={brand.image}/>}
      >

          <Meta 
            title={brand.name}
            description={
              <>
                <div className='brand-content'>
                <p>{brand.mission}</p>
                <p>{brand.description}</p>
                </div>

                <div className='brand-categories'>
                  {brand.categories?.map((tag,index) => (
                      <Tag
                        key={index}
                        color='cyan'
                        style={{ cursor: 'pointer', marginBottom: '4px'}}
                        onClick={() => onTagClick(tag)}
                      >
                       {tag}
                      </Tag>
                  ))}
                </div>

                <Button
                  type="default"
                  onClick={() => window.open(brand.website)}
                >
                  Visit Website Now!
                </Button>
              </>
            }
          />
      </Card>
  )
};

export default BrandCard;
