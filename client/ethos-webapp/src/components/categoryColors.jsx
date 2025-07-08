import { useState, useEffect } from 'react';
import api from '../services/api';

// In-memory cache for category color mapping
let categoryColorCache = null;
let isFetching = false;

// Fetch and store category color data
const fetchCategoryColors = async () => {
  if (categoryColorCache !== null || isFetching) return categoryColorCache;

  try {
    isFetching = true;
    const data = await api.categories.getAllCategoryColors();

    // Build a name-to-color map
    categoryColorCache = data.reduce((map, cat) => {
      if (cat.name && cat.color) {
        map[cat.name.toLowerCase()] = cat.color;
      }
      return map;
    }, {});

    return categoryColorCache;
  } catch (err) {
    console.error('Failed to fetch category colors:', err);
    categoryColorCache = {};
    return {};
  } finally {
    isFetching = false;
  }
};

// Preload colors at runtime
export const preloadCategoryColors = async () => {
  await fetchCategoryColors();
};

// Get a category's color (sync fallback returns null if not yet fetched)
export const getCachedCategoryColor = (name) => {
  if (!name || !categoryColorCache) return null;
  return categoryColorCache[name.toLowerCase()] || null;
};

// Get all colors as an object: { [name]: color }
export const getAllCachedCategoryColors = () => {
  return categoryColorCache || {};
};

// Async version to get a category color (waits for fetch if needed)
export const getCategoryColor = async (name) => {
  const map = await fetchCategoryColors();
  return map[name.toLowerCase()] || null;
};

export const CategoryColorsDisplay = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadColors = async () => {
      try {
        setLoading(true);
        const data = await api.categories.getAllCategoryColors();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load category colors:', err);
        setError('Could not load category colors');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadColors();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading category colors…</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>;
  if (!categories.length) return <p style={{ textAlign: 'center' }}>No categories found.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Category Colors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '20px' }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px' }}>
            <div
              style={{
                backgroundColor: cat.color,
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                border: '2px solid #ddd',
                marginRight: '12px'
              }}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{cat.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{cat.color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default getCategoryColor;
