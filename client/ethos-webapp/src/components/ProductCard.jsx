import React, { useState } from 'react';
import { Card, Typography, Button, Spin } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useFavorites } from '../contexts/FavoritesContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

const { Paragraph, Link } = Typography;
const { Meta } = Card;


// Function to render the product card with product title, image, price, description, website
const ProductCard = ({ productTitle, productPrice, productWebsite, productImage, onClick, showLink = false, productData }) => {
 const { user } = useAuth();
 const { isProductFavorite, toggleProductFavorite, cacheProductData } = useFavorites();
 const [imageLoading, setImageLoading] = useState(true);
 const [imageError, setImageError] = useState(false);

 // Create product data object for favorites
 const product = productData || {
   id: productTitle,
   title: productTitle,
   name: productTitle,
   price: productPrice,
   website: productWebsite,
   image: productImage
 };

 const isFavorite = isProductFavorite(product.id || product.title);

 const handleFavoriteClick = async (e) => {
   e.stopPropagation();
   // Cache the product data when favoriting
   cacheProductData(product.id || product.title, product);
   await toggleProductFavorite(product);
 };

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
     className="product-card"
     style={{
       width: '100%',
       borderRadius: '16px',
       overflow: 'hidden',
       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
       position: 'relative',
       transition: 'transform 0.3s ease, box-shadow 0.3s ease'
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
         {user && (
           <Button
             type="text"
             icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
             onClick={handleFavoriteClick}
             style={{
               position: 'absolute',
               top: '8px',
               right: '8px',
               color: isFavorite ? '#ff4d4f' : '#8c8c8c',
               backgroundColor: 'rgba(255, 255, 255, 0.9)',
               border: 'none',
               borderRadius: '50%',
               width: '36px',
               height: '36px',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               fontSize: '16px',
               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
             }}
           />
         )}
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
