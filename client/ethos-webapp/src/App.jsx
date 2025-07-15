import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AuthCallback from './pages/authCallback.jsx';
import SearchBrandsPage from './pages/SearchBrandsPage.jsx';
import BrandPage from './pages/BrandPage.jsx';
import SearchProductsPage from './pages/SearchProductsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import BrandAccountPage from './pages/BrandAccountPage.jsx';
import BrandUploadPage from './pages/BrandUploadPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { FavoritesProvider } from './contexts/FavoritesContext.jsx';

function AppRoutes() {
  const { loading, user } = useAuth();

  // Clean URL hash after auth tokens processed
  useEffect(() => {
    if (window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" /> : <SignUpPage />}
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/search-brands" element={<SearchBrandsPage />} />
      <Route path="/brands/:id" element={<BrandPage />} />
      <Route path="/search-products" element={<SearchProductsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />

      <Route
        path="/upload-brand"
        element={
          <ProtectedRoute>
            <BrandUploadPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute requiredRole="user">
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand-account"
        element={
          <ProtectedRoute requiredRole="brand">
            <BrandAccountPage />
          </ProtectedRoute>
        }
      />

      {/* Optional: catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <AppRoutes />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
