import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchBrandsPage from './pages/SearchBrandsPage.jsx';

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

  return (
    <Router>
      <Routes>
        <Route index element={<HomePage brands={allBrands} categories={brandCategories} />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search-brands" element={<SearchBrandsPage brands={allBrands} topTags={brandCategories} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
