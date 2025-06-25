import React from 'react';


function BrandCard() {
    return (
        <>
        <article className="brand-card">
            <div className="brand-card_image">
                <img src={brand-card-image} alt={alt} />
            </div>
            <div className="brand-card_content">
                <h3 className="brand-card-title">{brand-card-title}</h3>
                <p className="brand-card-description">{brand-card-description}</p>
                <p className="brand-card-mission">{brand-card-mission}</p>
                <a href={brand-card-link} className="brand-card-link">{brand-card-linkText}</a>
            </div>
        </article>
        </>
)}


export default BrandCard;
