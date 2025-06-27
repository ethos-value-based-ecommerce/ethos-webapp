import React from 'react';
import ValuesTag from './ValuesTag.jsx';

// Function to render the Brand Card
function BrandCard({ brand }) {
  return (
    <article className="brand-card">
      <div className="brand-card_image">
        <img src={brand.image} alt={brand.alt} />
      </div>

      <div className="brand-card_content">
        <h3 className="brand-card-title">{brand.name}</h3>
        <p className="brand-card-mission">{brand.mission}</p>
        <p className="brand-card-description">{brand.description}</p>
      

        <div className="brand-tags">
          {brand.categories && brand.categories.map((tag, index) => (
            <ValuesTag key={index} label={tag} />
          ))}
        </div>

        <a href={brand.website}>
          <button>{'Visit Website'}</button>
        </a>
      </div>
    </article>
  );
}


export default BrandCard;
