import { useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchBrandsPage from './pages/SearchBrandsPage.jsx';
import BrandPage from './pages/BrandPage.jsx';
import SearchProductsPage from './pages/SearchProductsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {brandCategories, categoryData, allBrands, brandProducts} from './assets/placeholderData.js';

function App() {
    const [user, setUser] = useState(null);

    // Placeholder login function - to be implemented with actual authentication
    const handleLogin = (userData) => {
        setUser(userData);
    };

  return (
    <Router>
      <Routes>
        <Route index element={<HomePage brands={allBrands} categories={brandCategories} />}/>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/search-brands" element={<SearchBrandsPage brands={allBrands} topTags={brandCategories} />}/>
        <Route path="/brands/:id" element={<BrandPage brands={allBrands} products={brandProducts}/>} />
        <Route path="/search-products" element={<SearchProductsPage products={brandProducts} brands={allBrands}/>}/>
        <Route path="/categories" element={<CategoriesPage categoryData={categoryData} />}/>
        <Route
            path="/account"
            element={
            <ProtectedRoute user={user}>
              <AccountPage user={user} brands={allBrands} products={brandProducts}/>
            </ProtectedRoute>
              }/>

      </Routes>
    </Router>
  );
}

export default App;
