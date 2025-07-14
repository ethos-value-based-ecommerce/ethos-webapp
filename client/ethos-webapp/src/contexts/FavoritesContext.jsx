import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { supabase } from '../services/supabaseClients.jsx';

const FavoritesContext = createContext({});

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({
    brands: [],
    products: []
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load user's favorites when they log in
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      // Clear favorites when user logs out
      setFavorites({ brands: [], products: [] });
    }
  }, [user]);

  // Load favorites from localStorage (fallback when database table doesn't exist)
  const loadFavoritesFromStorage = () => {
    if (!user) return;

    try {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        setFavorites({
          brands: parsed.brands || [],
          products: parsed.products || []
        });
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
  };

  // Save favorites to localStorage
  const saveFavoritesToStorage = (newFavorites) => {
    if (!user) return;

    try {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  };

  // Load favorites from database or fallback to localStorage
  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Try to load from database first
      const { data: userFavorites, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.log('Database table not found, using localStorage fallback');
        loadFavoritesFromStorage();
        setLoading(false);
        return;
      }

      console.log('User favorites data:', userFavorites);

      // Try different possible column names for the item identifier
      const getItemId = (fav) => {
        return fav.item_id || fav.favorite_id || fav.entity_id || fav.target_id || fav.content_id || fav.brand_id || fav.product_id;
      };

      // Separate brands and products from the favorites
      const brandFavorites = userFavorites?.filter(fav =>
        fav.type === 'brand' || fav.favorite_type === 'brand' || fav.entity_type === 'brand'
      ) || [];

      const productFavorites = userFavorites?.filter(fav =>
        fav.type === 'product' || fav.favorite_type === 'product' || fav.entity_type === 'product'
      ) || [];

      const brandIds = brandFavorites.map(fav => getItemId(fav)).filter(id => id);
      const productIds = productFavorites.map(fav => getItemId(fav)).filter(id => id);

      // Fetch brand details
      let brands = [];
      if (brandIds.length > 0) {
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('id, name, image, mission, description, website, categories')
          .in('id', brandIds);

        if (brandsError) throw brandsError;
        brands = brandsData || [];
      }

      // Fetch product details
      let products = [];
      if (productIds.length > 0) {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image, website, brand')
          .in('id', productIds);

        if (productsError) throw productsError;
        products = productsData || [];
      }

      setFavorites({
        brands: brands,
        products: products
      });
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to localStorage
      loadFavoritesFromStorage();
    } finally {
      setLoading(false);
    }
  };

  // Add brand to favorites
  const addBrandToFavorites = async (brand) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Try database first
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          item_id: brand.id,
          type: 'brand'
        });

      if (error) {
        // Fallback to localStorage
        const newFavorites = {
          ...favorites,
          brands: [...favorites.brands, brand]
        };
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);
        return { success: true };
      }

      // Database success
      setFavorites(prev => ({
        ...prev,
        brands: [...prev.brands, brand]
      }));
      return { success: true };
    } catch (error) {
      // Fallback to localStorage
      const newFavorites = {
        ...favorites,
        brands: [...favorites.brands, brand]
      };
      setFavorites(newFavorites);
      saveFavoritesToStorage(newFavorites);
      return { success: true };
    }
  };

  // Remove brand from favorites
  const removeBrandFromFavorites = async (brandId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Try database first
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', brandId)
        .eq('type', 'brand');

      if (error) {
        // Fallback to localStorage
        const newFavorites = {
          ...favorites,
          brands: favorites.brands.filter(brand => brand.id !== brandId)
        };
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);
        return { success: true };
      }

      // Database success
      setFavorites(prev => ({
        ...prev,
        brands: prev.brands.filter(brand => brand.id !== brandId)
      }));
      return { success: true };
    } catch (error) {
      // Fallback to localStorage
      const newFavorites = {
        ...favorites,
        brands: favorites.brands.filter(brand => brand.id !== brandId)
      };
      setFavorites(newFavorites);
      saveFavoritesToStorage(newFavorites);
      return { success: true };
    }
  };

  // Add product to favorites
  const addProductToFavorites = async (product) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Try database first
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          item_id: product.id,
          type: 'product'
        });

      if (error) {
        // Fallback to localStorage
        const newFavorites = {
          ...favorites,
          products: [...favorites.products, product]
        };
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);
        return { success: true };
      }

      // Database success
      setFavorites(prev => ({
        ...prev,
        products: [...prev.products, product]
      }));
      return { success: true };
    } catch (error) {
      // Fallback to localStorage
      const newFavorites = {
        ...favorites,
        products: [...favorites.products, product]
      };
      setFavorites(newFavorites);
      saveFavoritesToStorage(newFavorites);
      return { success: true };
    }
  };

  // Remove product from favorites
  const removeProductFromFavorites = async (productId) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      // Try database first
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_id', productId)
        .eq('type', 'product');

      if (error) {
        // Fallback to localStorage
        const newFavorites = {
          ...favorites,
          products: favorites.products.filter(product => product.id !== productId)
        };
        setFavorites(newFavorites);
        saveFavoritesToStorage(newFavorites);
        return { success: true };
      }

      // Database success
      setFavorites(prev => ({
        ...prev,
        products: prev.products.filter(product => product.id !== productId)
      }));
      return { success: true };
    } catch (error) {
      // Fallback to localStorage
      const newFavorites = {
        ...favorites,
        products: favorites.products.filter(product => product.id !== productId)
      };
      setFavorites(newFavorites);
      saveFavoritesToStorage(newFavorites);
      return { success: true };
    }
  };

  // Check if brand is favorited
  const isBrandFavorited = (brandId) => {
    return favorites.brands.some(brand => brand.id === brandId);
  };

  // Check if product is favorited
  const isProductFavorited = (productId) => {
    return favorites.products.some(product => product.id === productId);
  };

  // Toggle brand favorite status
  const toggleBrandFavorite = async (brand) => {
    if (isBrandFavorited(brand.id)) {
      return await removeBrandFromFavorites(brand.id);
    } else {
      return await addBrandToFavorites(brand);
    }
  };

  // Toggle product favorite status
  const toggleProductFavorite = async (product) => {
    if (isProductFavorited(product.id)) {
      return await removeProductFromFavorites(product.id);
    } else {
      return await addProductToFavorites(product);
    }
  };

  const value = {
    favorites,
    loading,
    addBrandToFavorites,
    removeBrandFromFavorites,
    addProductToFavorites,
    removeProductFromFavorites,
    isBrandFavorited,
    isProductFavorited,
    toggleBrandFavorite,
    toggleProductFavorite,
    loadFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
