import React from 'react';

function ProductCard() {
    return (
        <>
        <article className="product-card">
            <div className="product-card_image">
                <img src={product-card-image} alt={alt} />
            </div>
            <div className="product-card_content">
                <h3 className="product-card-title">{product-card-title}</h3>
                <p className="product-card-price">{product-card-price}</p>
                <p className="product-card-description">{product-card-description}</p>
                <a href={product-card-link} className="product-card-link">{product-card-linkText}</a>
            </div>
        </article>
        </>
)}


export default ProductCard;
