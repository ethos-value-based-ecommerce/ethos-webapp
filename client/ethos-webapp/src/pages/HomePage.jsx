import React from 'react';
import { Link } from "react-router-dom";
import BrandCard from '../components/BrandCard.jsx';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

// Function to render the home page, including the header, navigation bar, discover section, categories section, and featured section
const HomePage = ({ brands, categories }) => {
  return (
    <main className='main-page'>
      <header className='website-header'>
        <h1>ETHOS</h1>
      </header>

      <NavBar />

      <section className='discover-section'>
        <h2>Discover brands that match your values</h2>
        <p>Find brands and products that align with your values and support causes you care about.</p>
        <Link to="/search-brands"><button>Start Your Search Now</button></Link>
      </section>

      <section className='categories-section'>
        <h2>Browse by category</h2>
        <ul>
          {categories.slice(0, 3).map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </section>

      <section className='featured-section'>
        <h2>Featured Brands</h2>
        <div className='featured-brands-grid'>
          {brands.slice(0, 6).map((brand) => (
            <Link to={`/brands/${brand.id}`}>
            <BrandCard key={brand.id} brand={brand}/>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;
