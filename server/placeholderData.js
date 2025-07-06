
const brandCategories = [
    "Clothing", "Beauty", "Home", "Food", "Travel", "Wellness",
    "Sustainability", "Social Impact", "Ethical Living", "Vegan", "Cruelty-Free"
  ];

// Category descriptions
const categoryDescriptions = {
  "Clothing": {
    description: "Sustainable and ethical fashion brands that prioritize fair labor practices, eco-friendly materials, and responsible manufacturing processes.",
    color: "blue",
    icon: "👕"
  },
  "Beauty": {
    description: "Clean beauty brands offering cruelty-free, non-toxic, and environmentally conscious skincare, makeup, and personal care products.",
    color: "pink",
    icon: "💄"
  },
  "Home": {
    description: "Eco-friendly home goods and decor brands focused on sustainable materials, ethical production, and creating healthier living spaces.",
    color: "green",
    icon: "🏠"
  },
  "Food": {
    description: "Ethical food brands committed to organic farming, fair trade practices, sustainable packaging, and supporting local communities.",
    color: "orange",
    icon: "🍎"
  },
  "Travel": {
    description: "Responsible travel companies and brands promoting sustainable tourism, cultural respect, and environmental conservation.",
    color: "cyan",
    icon: "✈️"
  },
  "Wellness": {
    description: "Holistic wellness brands offering natural health products, mindfulness resources, and promoting overall well-being and mental health.",
    color: "purple",
    icon: "🧘"
  },
  "Sustainability": {
    description: "Brands dedicated to environmental protection through renewable energy, waste reduction, circular economy practices, and climate action.",
    color: "green",
    icon: "🌱"
  },
  "Social Impact": {
    description: "Companies with strong social missions, supporting communities, promoting equality, and creating positive change in society.",
    color: "orange",
    icon: "🤝"
  },
  "Ethical Living": {
    description: "Brands promoting conscious consumption, transparency in business practices, and encouraging mindful lifestyle choices.",
    color: "red",
    icon: "⚖️"
  },
  "Vegan": {
    description: "Plant-based brands offering vegan alternatives across food, beauty, fashion, and lifestyle products without animal-derived ingredients.",
    color: "blue",
    icon: "🌿"
  },
  "Cruelty-Free": {
    description: "Brands committed to never testing on animals and ensuring their entire supply chain maintains cruelty-free standards.",
    color: "purple",
    icon: "🐰"
  }
};

// Generate category data from brandCategories array
const categoryData = brandCategories.map(category => ({
  name: category,
  ...categoryDescriptions[category]
}));

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

  const brandProducts = [
  {
    id: 1,
    brandId: 1,
    title: "Organic Cotton T-Shirt",
    image: "https://picsum.photos/200/300",
    price: "$24.99",
    description: "Made from 100% organic cotton, this tee is soft, breathable, and eco-friendly.",
    website: "https://greenthreads.com/product1",
    linkText: "Shop Now",
    alt: "Organic Cotton T-Shirt"
  },
  {
    id: 2,
    brandId: 1,
    title: "Recycled Denim Jeans",
    image: "https://picsum.photos/200/301",
    price: "$49.99",
    description: "Stylish jeans made from recycled materials with ethical labor practices.",
    website: "https://greenthreads.com/product2",
    linkText: "Learn More",
    alt: "Recycled Denim Jeans"
  },
  {
    id: 3,
    brandId: 2,
    title: "Vegan Face Cleanser",
    image: "https://picsum.photos/200/302",
    price: "$19.99",
    description: "Gentle, plant-based face cleanser suitable for all skin types.",
    website: "https://pureglow.com/product1",
    linkText: "Buy Now",
    alt: "Vegan Face Cleanser"
  },
  {
    id: 4,
    brandId: 2,
    title: "Cruelty-Free Moisturizer",
    image: "https://picsum.photos/200/303",
    price: "$22.99",
    description: "Hydrating moisturizer with no animal testing or byproducts.",
    website: "https://pureglow.com/product2",
    linkText: "Read Reviews",
    alt: "Cruelty-Free Moisturizer"
  },
  {
    id: 5,
    brandId: 3,
    title: "Single-Origin Coffee Beans",
    image: "https://picsum.photos/200/304",
    price: "$15.99",
    description: "Fresh, organic coffee beans sourced directly from farmers.",
    website: "https://beanethics.com/product1",
    linkText: "Get Started",
    alt: "Single-Origin Coffee"
  },
  {
    id: 6,
    brandId: 3,
    title: "Cold Brew Concentrate",
    image: "https://picsum.photos/200/305",
    price: "$18.99",
    description: "Ready-to-drink cold brew made from ethically sourced beans.",
    website: "https://beanethics.com/product2",
    linkText: "Shop Now",
    alt: "Cold Brew Concentrate"
  }
];

// Utility functions for data access
const getBrandTags = () => {
  return categoryData;
};

const getAllBrands = () => {
  return allBrands;
};

const getBrandById = (id) => {
  const brand = allBrands.find(b => b.id === parseInt(id));
  if (!brand) {
    return null;
  }

  // Get products for this brand
  const products = brandProducts.filter(p => p.brandId === brand.id);

  return {
    ...brand,
    products
  };
};

const searchProducts = (query = '', category = '') => {
  let filteredProducts = brandProducts;

  if (query) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category) {
    // Filter by brand category
    const brandsInCategory = allBrands
      .filter(brand => brand.categories.includes(category))
      .map(brand => brand.id);

    filteredProducts = filteredProducts.filter(product =>
      brandsInCategory.includes(product.brandId)
    );
  }

  return {
    products: filteredProducts,
    query,
    category,
    total: filteredProducts.length
  };
};

const searchBrands = (query = '', category = '') => {
  let filteredBrands = allBrands;

  if (query) {
    filteredBrands = filteredBrands.filter(brand =>
      brand.name.toLowerCase().includes(query.toLowerCase()) ||
      brand.description.toLowerCase().includes(query.toLowerCase()) ||
      brand.mission.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category) {
    filteredBrands = filteredBrands.filter(brand =>
      brand.categories.includes(category)
    );
  }

  return {
    brands: filteredBrands,
    query,
    category,
    total: filteredBrands.length
  };
};

const getBrandCategories = () => {
  return allBrands.map(brand => ({
    id: brand.id,
    name: brand.name,
    categories: brand.categories
  }));
};

const getAllProducts = () => {
  return brandProducts;
};

const getProductCategories = () => {
  // Return each product with its categories (from its brand)
  return brandProducts.map(product => {
    const brand = allBrands.find(b => b.id === product.brandId);
    return {
      id: product.id,
      title: product.title,
      brandId: product.brandId,
      brandName: brand ? brand.name : 'Unknown Brand',
      categories: brand ? brand.categories : []
    };
  });
};

const getProductById = (id) => {
  const product = brandProducts.find(p => p.id === parseInt(id));
  if (!product) {
    return null;
  }

  // Get the brand information for this product
  const brand = allBrands.find(b => b.id === product.brandId);

  return {
    ...product,
    brand: brand ? {
      id: brand.id,
      name: brand.name,
      categories: brand.categories
    } : null
  };
};

module.exports = {
  brandCategories,
  categoryData,
  allBrands,
  brandProducts,
  getBrandTags,
  getAllBrands,
  getBrandById,
  searchProducts,
  searchBrands,
  getBrandCategories,
  getAllProducts,
  getProductCategories,
  getProductById
};
