import React from 'react';
import { Link } from "react-router-dom";
import BrandCard from '../components/BrandCard';


const HomePage = () => {

  // Placeholder data for the brand categories and featured brands
  const brandCategories = ["Clothing", "Beauty", "Home", "Food", "Travel", "Wellness", "Sustainability", "Social Impact", "Ethical Living",
    "Vegan", "Cruelty-Free", "Fair Trade", "Organic", "Local", "Small Business", "Artisan", "Handmade", "Zero Waste"]

  const featuredBrands =
    [{
      id: 1,
      image: "https://picsum.photos/id/1011/400/300",
      alt: "Eco-friendly clothing brand logo",
      name: "GreenThreads",
      description: "Sustainable fashion made from organic and recycled materials.",
      mission: "To reduce the environmental impact of clothing by promoting eco-friendly materials and ethical labor practices.",
      website: "https://greenthreads.com",
      linkText: "Shop GreenThreads"
    },
    {
      id: 2,
      image: "https://picsum.photos/id/1025/400/300",
      alt: "Cruelty-free skincare brand logo",
      name: "PureGlow",
      description: "Vegan, cruelty-free skincare products for all skin types.",
      mission: "To provide high-quality skincare without harming animals or the planet.",
      website: "https://pureglow.com",
      linkText: "Explore PureGlow"
    },
    {
      id: 3,
      image: "https://picsum.photos/id/1043/400/300",
      alt: "Fair trade coffee brand logo",
      name: "BeanEthics",
      description: "Fair trade, organic coffee sourced directly from farmers.",
      mission: "To empower coffee farmers and ensure fair wages through direct trade relationships.",
      website: "https://beanethics.com",
      linkText: "Try BeanEthics"
    }
  ];
  // Function to render the home page, including the header, navigation bar, discover section, categories section, and featured section
  return (
    <main className='main-page'>
     <header className='website-header'>
        <h1>ETHOS</h1>
     </header>

     <nav className='navigation-bar'>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/login'>Login</Link></li>
          <li><Link to='/categories'>Categories</Link></li>
          <li><Link to='/brands'>Search Brands</Link></li>
          <li><Link to='/products'>Search Products</Link></li>
          <li><Link to='/account'>Account</Link></li>
        </ul>
     </nav>

     <section className='discover-section'>
        <h2>Discover brands that match your values</h2>
        <p>Find brands and products that align with your values and support causes you care about.</p>
        <button> Start Your Search Now</button>
     </section>

     <section className='categories-section'>
        <h2>Browse by category</h2>
        <ul>
          {brandCategories.slice(0,3).map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
     </section>

     <section className='featured-section'>
        <h2>Featured Brands</h2>
        <div className='featured-brands-grid'>
            {featuredBrands.slice(0,6).map((brand) => (
                <BrandCard
                  key={brand.id}
                  brandImage={brand.image}
                  brandTitle={brand.name}
                  brandDescription={brand.description}
                  brandMission={brand.mission}
                  brandWebsite={brand.website}
                  brandLinkText={brand.linkText}
                  alt={`${brand.name} logo`}
                />
                ))}
        </div>
     </section>
</main>

  )

}

export default HomePage;
