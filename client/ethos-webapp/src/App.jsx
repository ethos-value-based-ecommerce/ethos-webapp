import { useState } from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

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
import { AuthProvider } from './contexts/AuthContext.jsx';

function App() {
 return (
   <AuthProvider>
     <Router>
       <Routes>
         <Route index element={<HomePage />}/>
         <Route path="/login" element={<LoginPage />} />
         <Route path="/signup" element={<SignUpPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} />
         <Route path="/reset-password" element={<ResetPasswordPage />} />
         <Route path="/auth/callback" element={<AuthCallback />} />
         <Route path="/search-brands" element={<SearchBrandsPage />}/>
         <Route path="/brands/:id" element={<BrandPage />} />
         <Route path="/search-products" element={<SearchProductsPage />}/>
         <Route path="/categories" element={<CategoriesPage />}/>
         <Route
             path="/upload-brand"
             element={
             <ProtectedRoute>
               <BrandUploadPage />
             </ProtectedRoute>
               }/>
         <Route
             path="/account"
             element={
             <ProtectedRoute>
               <AccountPage />
             </ProtectedRoute>
               }/>
         <Route
             path="/brand-account"
             element={
             <ProtectedRoute>
               <BrandAccountPage />
             </ProtectedRoute>
               }/>

       </Routes>
     </Router>
   </AuthProvider>
 );
}

export default App;
