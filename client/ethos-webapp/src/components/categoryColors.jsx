import { categoryData } from '../assets/placeholderData.js';

// Create a mapping of category names to their colors
const categoryColorMap = categoryData.reduce((map, category) => {
  map[category.name] = category.color;
  return map;
}, {});

// Function to get the color for a specific category
export const getCategoryColor = (categoryName) => {
  return categoryColorMap[categoryName] || 'default';
};

// Function to get all category colors as an object
export const getAllCategoryColors = () => {
  return categoryColorMap;
};

export default getCategoryColor;
