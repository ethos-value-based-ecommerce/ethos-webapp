const API_BASE_URL = 'http://localhost:3000';

// API Resquest Front-End Function
const apiRequest = async (endpoint, options = {}) => {
 try {
   const url = `${API_BASE_URL}${endpoint}`;
   const config = {
     headers: {
       'Content-Type': 'application/json',
       ...options.headers,
     },
     ...options,
   };


   const response = await fetch(url, config);


   if (!response.ok) {
     throw new Error(`HTTP error! status: ${response.status}`);
   }


   const data = await response.json();
   return data;
 } catch (error) {
   console.error(`API request failed for ${endpoint}:`, error);
   throw error;
 }
};


// Brand API functions
export const brandsApi = {
 // Get all brands
 getAll: async () => {
   const response = await apiRequest('/brands');
   return response.data || [];
 },


 // Get brand by ID
 getById: async (id) => {
   const response = await apiRequest(`/brands/${id}`);
   return response.data;
 },

// Search brands
 search: async (query, category, brand, limit = 10) => {
  // Avoid sending empty searches to backend
  const hasValidInput = query || category || brand;
  if (!hasValidInput) {
    console.warn('Search aborted: No query, category, or brand specified.');
    return [];
  }

  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (category) params.append('category', category);
  if (brand) params.append('brand', brand);
  if (limit) params.append('limit', limit.toString());

  const endpoint = `/products/search${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await apiRequest(endpoint);
  return response.data || [];
},


 // Create new brand
 create: async (brandData) => {
   const response = await apiRequest('/brands', {
     method: 'POST',
     body: JSON.stringify(brandData),
   });
   return response.data;
 },


 // Update brand
 update: async (id, brandData) => {
   const response = await apiRequest(`/brands/${id}`, {
     method: 'PUT',
     body: JSON.stringify(brandData),
   });
   return response.data;
 },


 // Get categories for a specific brand
 getCategories: async (id) => {
   const response = await apiRequest(`/brands/${id}/categories`);
   return response.data || [];
 },
};


// Categories API functions
export const categoriesApi = {
 // Get all categories
 getAll: async () => {
   const response = await apiRequest('/categories');
   return response.data || [];
 },


 // Get brand categories (brand-category relationships)
 getBrandCategories: async () => {
   const response = await apiRequest('/brands/categories');
   return response.data || [];
 },

 // Get all category colors
 getAllCategoryColors: async () => {
   const response = await apiRequest('/categories/color');
   return response.data || [];
 },
};


// Products API functions
export const productsApi = {
 // Get products for a specific brand
 getByBrand: async (brand) => {
   const params = new URLSearchParams({ brand });
   const response = await apiRequest(`/products?${params.toString()}`);
   return response.data || [];
 },


 // Get all products (limited)
 getAll: async (limit = 5) => {
   const params = new URLSearchParams({ limit: limit.toString() });
   const response = await apiRequest(`/products/all?${params.toString()}`);
   return response.data || [];
 },

 // Get personalized recommendations based on quiz answers
 getRecommendations: async (preferences) => {
   const response = await apiRequest('/recommendations', {
     method: 'POST',
     body: JSON.stringify(preferences),
   });
   return response; // Return the full response
 },


 // Search products
 search: async (query, category, brand, limit = 20) => {
   const params = new URLSearchParams();
   if (query) params.append('query', query);
   if (category) params.append('category', category);
   if (brand) params.append('brand', brand);
   if (limit) params.append('limit', limit.toString());


   const endpoint = `/products/search${params.toString() ? `?${params.toString()}` : ''}`;
   const response = await apiRequest(endpoint);
   return response.data || [];
 },


 // Get product categories
 getCategories: async () => {
   const response = await apiRequest('/product/categories');
   return response.data || [];
 },
};


// Recommendations API functions
export const recommendationsApi = {
 // Get personalized recommendations based on quiz answers
 get: async (preferences) => {
   const response = await apiRequest('/recommendations', {
     method: 'POST',
     body: JSON.stringify(preferences),
   });
   return response; // Return the full response
 },
};

// Brand Upload API functions
export const brandUploadApi = {
 // Get all scraped brands
 getAll: async () => {
   const response = await apiRequest('/brand-upload');
   return response || [];
 },

 // Upload a brand (which triggers scraping)
 upload: async (brandData) => {
   const response = await apiRequest('/brand-upload', {
     method: 'POST',
     body: JSON.stringify(brandData),
   });
   return response;
 },

 // Delete a scraped brand
 delete: async (id) => {
   const response = await apiRequest(`/brand-upload/${id}`, {
     method: 'DELETE',
   });
   return response;
 },
};

// Export default API object
const api = {
 brands: brandsApi,
 categories: categoriesApi,
 products: productsApi,
 recommendations: recommendationsApi,
 brandUpload: brandUploadApi,
};


export default api;
