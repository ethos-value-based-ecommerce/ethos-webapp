import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchBrandsPage from './pages/SearchBrandsPage.jsx';
import BrandPage from './pages/BrandPage.jsx';

function App() {
  const brandCategories = [
    "Clothing", "Beauty", "Home", "Food", "Travel", "Wellness",
    "Sustainability", "Social Impact", "Ethical Living", "Vegan", "Cruelty-Free"
  ];

  const allBrands = [
    {
      id: 1,
      image: "https://picsum.photos/id/1011/400/300",
      alt: "Eco-friendly clothing brand logo",
      name: "GreenThreads",
      description: "Sustainable fashion made from organic and recycled materials.",
      mission: "To reduce the environmental impact of clothing by promoting eco-friendly materials and ethical labor practices.",
      website: "https://greenthreads.com",
      linkText: "Shop GreenThreads",
      categories: ["Clothing", "Sustainability", "Ethical Living"]
    },
    {
      id: 2,
      image: "https://picsum.photos/id/1025/400/300",
      alt: "Cruelty-free skincare brand logo",
      name: "PureGlow",
      description: "Vegan, cruelty-free skincare products for all skin types.",
      mission: "To provide high-quality skincare without harming animals or the planet.",
      website: "https://pureglow.com",
      linkText: "Explore PureGlow",
      categories: ["Beauty", "Vegan", "Cruelty-Free"]
    },
    {
      id: 3,
      image: "https://picsum.photos/id/1043/400/300",
      alt: "Fair trade coffee brand logo",
      name: "BeanEthics",
      description: "Fair trade, organic coffee sourced directly from farmers.",
      mission: "To empower coffee farmers and ensure fair wages through direct trade relationships.",
      website: "https://beanethics.com",
      linkText: "Try BeanEthics",
      categories: ["Food", "Social Impact", "Sustainability"]
    }
  ];

  const brandProducts = [
  {
    id: 1,
    brandId: 1,
    title: "Organic Cotton T-Shirt",
    image: "https://picsum.photos/200/300",
    price: "$24.99",
    description: "Made from 100% organic cotton, this tee is soft, breathable, and eco-friendly.",
    website: "https://greenthreads.com/product1",
    linkText: "Shop Now",
    alt: "Organic Cotton T-Shirt"
  },
  {
    id: 2,
    brandId: 1,
    title: "Recycled Denim Jeans",
    image: "https://picsum.photos/200/301",
    price: "$49.99",
    description: "Stylish jeans made from recycled materials with ethical labor practices.",
    website: "https://greenthreads.com/product2",
    linkText: "Learn More",
    alt: "Recycled Denim Jeans"
  },
  {
    id: 3,
    brandId: 2,
    title: "Vegan Face Cleanser",
    image: "https://picsum.photos/200/302",
    price: "$19.99",
    description: "Gentle, plant-based face cleanser suitable for all skin types.",
    website: "https://pureglow.com/product1",
    linkText: "Buy Now",
    alt: "Vegan Face Cleanser"
  },
  {
    id: 4,
    brandId: 2,
    title: "Cruelty-Free Moisturizer",
    image: "https://picsum.photos/200/303",
    price: "$22.99",
    description: "Hydrating moisturizer with no animal testing or byproducts.",
    website: "https://pureglow.com/product2",
    linkText: "Read Reviews",
    alt: "Cruelty-Free Moisturizer"
  },
  {
    id: 5,
    brandId: 3,
    title: "Single-Origin Coffee Beans",
    image: "https://picsum.photos/200/304",
    price: "$15.99",
    description: "Fresh, organic coffee beans sourced directly from farmers.",
    website: "https://beanethics.com/product1",
    linkText: "Get Started",
    alt: "Single-Origin Coffee"
  },
  {
    id: 6,
    brandId: 3,
    title: "Cold Brew Concentrate",
    image: "https://picsum.photos/200/305",
    price: "$18.99",
    description: "Ready-to-drink cold brew made from ethically sourced beans.",
    website: "https://beanethics.com/product2",
    linkText: "Shop Now",
    alt: "Cold Brew Concentrate"
  }
];

  return (
    <Router>
      <Routes>
        <Route index element={<HomePage brands={allBrands} categories={brandCategories} />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search-brands" element={<SearchBrandsPage brands={allBrands} topTags={brandCategories} />}/>
        <Route path="/brands/:id" element={<BrandPage brands={allBrands} products={brandProducts}/>} />
      </Routes>
    </Router>
  );
}

export default App;
