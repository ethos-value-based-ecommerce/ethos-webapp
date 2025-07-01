import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchBrandsPage from './pages/SearchBrandsPage.jsx';
import BrandPage from './pages/BrandPage.jsx';
import SearchProductsPage from './pages/SearchProductsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import {brandCategories, categoryData, allBrands, brandProducts} from './assets/placeholderData.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage brands={allBrands} categories={brandCategories} />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search-brands" element={<SearchBrandsPage brands={allBrands} topTags={brandCategories} />}/>
        <Route path="/brands/:id" element={<BrandPage brands={allBrands} products={brandProducts}/>} />
        <Route path="/search-products" element={<SearchProductsPage products={brandProducts} brands={allBrands}/>}/>
        <Route path="/categories" element={<CategoriesPage categoryData={categoryData} />}/>
      </Routes>
    </Router>
  );
}

export default App;
