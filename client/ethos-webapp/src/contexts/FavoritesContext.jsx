import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { supabase } from '../services/supabaseClients.jsx';
import { brandsApi, productsApi } from '../services/api.jsx';
import { message } from 'antd';

const FavoritesContext = createContext({});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favoriteBrands, setFavoriteBrands] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [productsCache, setProductsCache] = useState({});
  const [loading, setLoading] = useState(false);

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadUserFavorites();
      loadBrandsData();
    } else {
      // Clear favorites when user logs out
      setFavoriteBrands([]);
      setFavoriteProducts([]);
    }
  }, [user]);

  // Load user's favorites from database
  const loadUserFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load favorite brands
      const { data: brandFavorites, error: brandError } = await supabase
        .from('user_favorite_brands')
        .select('brand_id')
        .eq('user_id', user.id);

      if (brandError) throw brandError;

      // Load favorite products
      const { data: productFavorites, error: productError } = await supabase
        .from('user_favorite_products')
        .select('product_id, product_data')
        .eq('user_id', user.id);

      if (productError) throw productError;

      setFavoriteBrands(brandFavorites?.map(f => f.brand_id) || []);
      setFavoriteProducts(productFavorites?.map(f => ({
        id: f.product_id,
        ...f.product_data
      })) || []);

    } catch (error) {
      console.error('Error loading favorites:', error);
      message.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  // Load brands data from API
  const loadBrandsData = async () => {
    try {
      const brands = await brandsApi.getAll();
      setBrandsData(brands);
    } catch (error) {
      console.error('Error loading brands:', error);
      message.error('Failed to load brands data');
    }
  };

  // Cache products data
  const cacheProductData = (productId, productData) => {
    setProductsCache(prev => ({
      ...prev,
      [productId]: productData
    }));
  };

  // Add brand to favorites
  const addBrandToFavorites = async (brandId) => {
    if (!user) {
      message.warning('Please log in to add favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_favorite_brands')
        .insert({
          user_id: user.id,
          brand_id: brandId
        });

      if (error) throw error;

      setFavoriteBrands(prev => [...prev, brandId]);
      message.success('Brand added to favorites!');
      return true;
    } catch (error) {
      console.error('Error adding brand to favorites:', error);
      message.error('Failed to add brand to favorites');
      return false;
    }
  };

  // Remove brand from favorites
  const removeBrandFromFavorites = async (brandId) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_favorite_brands')
        .delete()
        .eq('user_id', user.id)
        .eq('brand_id', brandId);

      if (error) throw error;

      setFavoriteBrands(prev => prev.filter(id => id !== brandId));
      message.success('Brand removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing brand from favorites:', error);
      message.error('Failed to remove brand from favorites');
      return false;
    }
  };

  // Add product to favorites
  const addProductToFavorites = async (productData) => {
    if (!user) {
      message.warning('Please log in to add favorites');
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_favorite_products')
        .insert({
          user_id: user.id,
          product_id: productData.id || productData.title,
          product_data: productData
        });

      if (error) throw error;

      setFavoriteProducts(prev => [...prev, productData]);
      cacheProductData(productData.id || productData.title, productData);
      message.success('Product added to favorites!');
      return true;
    } catch (error) {
      console.error('Error adding product to favorites:', error);
      message.error('Failed to add product to favorites');
      return false;
    }
  };

  // Remove product from favorites
  const removeProductFromFavorites = async (productId) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_favorite_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setFavoriteProducts(prev => prev.filter(p => (p.id || p.title) !== productId));
      message.success('Product removed from favorites');
      return true;
    } catch (error) {
      console.error('Error removing product from favorites:', error);
      message.error('Failed to remove product from favorites');
      return false;
    }
  };

  // Toggle brand favorite
  const toggleBrandFavorite = async (brandId) => {
    const isFavorite = favoriteBrands.includes(brandId);
    if (isFavorite) {
      return await removeBrandFromFavorites(brandId);
    } else {
      return await addBrandToFavorites(brandId);
    }
  };

  // Toggle product favorite
  const toggleProductFavorite = async (productData) => {
    const productId = productData.id || productData.title;
    const isFavorite = favoriteProducts.some(p => (p.id || p.title) === productId);

    if (isFavorite) {
      return await removeProductFromFavorites(productId);
    } else {
      return await addProductToFavorites(productData);
    }
  };

  // Check if brand is favorite
  const isBrandFavorite = (brandId) => {
    return favoriteBrands.includes(brandId);
  };

  // Check if product is favorite
  const isProductFavorite = (productId) => {
    return favoriteProducts.some(p => (p.id || p.title) === productId);
  };

  // Get favorite brands with full data
  const getFavoriteBrandsWithData = () => {
    return brandsData.filter(brand => favoriteBrands.includes(brand.id));
  };

  const value = {
    favoriteBrands,
    favoriteProducts,
    brandsData,
    productsCache,
    loading,
    addBrandToFavorites,
    removeBrandFromFavorites,
    addProductToFavorites,
    removeProductFromFavorites,
    toggleBrandFavorite,
    toggleProductFavorite,
    isBrandFavorite,
    isProductFavorite,
    getFavoriteBrandsWithData,
    loadUserFavorites,
    loadBrandsData,
    cacheProductData
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
