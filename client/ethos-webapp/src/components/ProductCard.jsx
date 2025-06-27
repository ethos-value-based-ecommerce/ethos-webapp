import React from 'react';

// Function to render the product card with product title, image, price, description, website
function ProductCard({productImage, productTitle, productPrice, productDescription, productWebsite, alt, onClick, showLink = true}) {
    return (
        <article className="product-card" onClick={onClick}>
            <div className="product-card_image">
                <img src={productImage} alt={alt} />
            </div>
            <div className="product-card_content">
                <h3 className="product-card-title">{productTitle}</h3>
                <p className="product-card-price">{productPrice}</p>
                <p className="product-card-description">{productDescription}</p>
                
                {showLink && productWebsite && (
                    <a href={productWebsite}>
                    <button>{"Shop Now"}</button>
                    </a>
                )}
            </div>
        </article>
)};


export default ProductCard;
