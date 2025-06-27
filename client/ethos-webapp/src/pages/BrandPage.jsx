import React, {useState} from 'react';
import { useParams } from 'react-router-dom';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from  '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';

// Function to render the individual brand pages with brand infomration and it's product information
const BrandPage = ({brands, products}) => {
    const { id } = useParams();
    const brandId = parseInt( id );
    const brand = brands.find((b) => b.id === brandId);
    const brandProducts = products.filter((p) => p.brandId === brandId);

    const [selectedProduct, setSeletedProduct] = useState(null);
    const handleProductClick = (product) => setSeletedProduct(product);
    const closeModal = () =>  setSeletedProduct(null);


    return (

        <main className='brand-idv-page'>
            <NavBar />
            
            <section className='brand-information'>
                <BrandCard brand={brand}/>
            </section>

            <section className='brand-products'>
                <h2>Products</h2>
                <ul className='brand-product-list'>
                    {brandProducts.map((product) => (
                        <li key={product.id}>
                        <ProductCard
                            onClick={() => handleProductClick(product)}
                            productTitle={product.title}
                            productImage={product.image}
                            productPrice={product.price}
                        />
                        </li>
                    ))}
                </ul>
            </section>

            <ProductModal isOpen={!!selectedProduct} onClose={closeModal}>
                    {selectedProduct && (
                    <ProductCard
                        key={selectedProduct.id}
                        productImage={selectedProduct.image}
                        productTitle={selectedProduct.title}
                        productPrice={selectedProduct.price}
                        productDescription={selectedProduct.description}
                        productWebsite={selectedProduct.website}
                        productLinkText={selectedProduct.linkText}
                        alt={selectedProduct.alt}
                        />
                         )}
                    </ProductModal>

            <Footer />
        </main>
    )

};

export default BrandPage;