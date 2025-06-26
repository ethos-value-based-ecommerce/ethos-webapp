import React from 'react';

// Function to render the product card
function ProductCard({productImage, productTitle, productPrice, productDescription, productWebsite, productLinkText}) {
    return (
        <article className="product-card">
            <div className="product-card_image">
                <img src={productImage} alt={alt} />
            </div>
            <div className="product-card_content">
                <h3 className="product-card-title">{productTitle}</h3>
                <p className="product-card-price">{productPrice}</p>
                <p className="product-card-description">{productDescription}</p>
                <a href={productWebsite}>
                    <button>Visit Website</button>
                </a>
            </div>
        </article>
)}


export default ProductCard;
