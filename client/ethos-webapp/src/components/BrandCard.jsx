import React from 'react';

// Function to render the Brand Card
function BrandCard({ brandImage, brandTitle, brandDescription, brandMission, brandWebsite, brandLinkText, alt }) {
    return (
        <>
        <article className="brand-card">
            <div className="brand-card_image">
                <img src={brandImage} alt={alt} />
            </div>
            <div className="brand-card_content">
                <h3 className="brand-card-title">{brandTitle}</h3>
                <p className="brand-card-description">{brandDescription}</p>
                <p className="brand-card-mission">{brandMission}</p>
                <a href={brandWebsite}>
                    <button>Visit Website</button>
                </a>
            </div>
        </article>
        </>
)}


export default BrandCard;
