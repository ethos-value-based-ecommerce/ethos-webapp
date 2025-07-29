import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Typography, Input, Button, Row, Col, Tag, Spin, Alert, Empty } from 'antd';
import { SearchOutlined, ClearOutlined, LoadingOutlined } from '@ant-design/icons';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import { brandsApi, categoriesApi } from '../services/api.jsx';

// Importing category color for tag colors
import { preloadCategoryColors, getCachedCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';
import '../styling/SearchBrandsPage.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;


// Function to handle the Search Brands Page
const SearchBrandsPage = () => {
  const [brandSearch, setBrandSearch] = useState('');
  const [allBrands, setAllBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colorCacheReady, setColorCacheReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [brandsData, brandCategoriesData, categoriesData] = await Promise.all([
          brandsApi.getAll(),
          categoriesApi.getBrandCategories(),
          categoriesApi.getAll(),
          preloadCategoryColors()
        ]);

        setColorCacheReady(true);

        const brandsWithCategories = brandsData.map(brand => {
          const brandCategories = brandCategoriesData
            .filter(bc => bc.brand_name === brand.name)
            .map(bc => bc.category_name);

          return {
            ...brand,
            categories: brandCategories
          };
        });

        setAllBrands(brandsWithCategories);
        setFilteredBrands(brandsWithCategories);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load brands data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const performSearch = useCallback(async (searchTerm, selectedCats) => {
    if (!searchTerm.trim() && selectedCats.length === 0) {
      setFilteredBrands(allBrands);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      let results = allBrands;

      if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        results = results.filter(brand =>
          brand.name.toLowerCase().includes(lowerSearch) ||
          (brand.categories && brand.categories.some(cat =>
            cat.toLowerCase().includes(lowerSearch)
          ))
        );
      }

      if (selectedCats.length > 0) {
        results = results.filter(brand =>
          brand.categories &&
          selectedCats.every(selectedCat =>
            brand.categories.some(category =>
              category.toLowerCase() === selectedCat.toLowerCase()
            )
          )
        );
      }

      setFilteredBrands(results);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  }, [allBrands]);

// Function to handle filtering by categories
  const handleTagClick = (tag) => {
    let newSelectedCategories;

    if (selectedCategories.includes(tag)) {
      // Remove category if already selected
      newSelectedCategories = selectedCategories.filter(cat => cat !== tag);
    } else {
      // Add category if not selected
      newSelectedCategories = [...selectedCategories, tag];
    }

    setSelectedCategories(newSelectedCategories);

    // Filter brands based on selected categories
    performSearch(brandSearch, newSelectedCategories);
  };

  const handleSearch = () => {
    performSearch(brandSearch, selectedCategories);
  };

 // Check for selectedCategory from navigation state and filter
  useEffect(() => {
    if (location.state?.selectedCategory && allBrands.length > 0) {
      const category = location.state.selectedCategory;
      setSelectedCategories([category]);
      performSearch('', [category]);
    }
  }, [location.state, allBrands, performSearch]);

// Function to handle clearing search
  const handleClear = () => {
    setBrandSearch('');
    setSelectedCategories([]);
    setFilteredBrands(allBrands);
    setError(null);
  };

  if (loading) {
    return (
      <Layout className="search-page-layout">
        <Header className="search-page-header">
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} className="search-page-title">ETHOS</Title>
            </Col>
            <Col>
              <NavBar />
            </Col>
          </Row>
        </Header>
        <Content className="loading-container">
          <Spin size="large" indicator={<LoadingOutlined className="loading-icon" spin />} />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="search-page-layout">
      <Header className="search-page-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Link to="/">
              <Title level={3} className="search-page-title">ETHOS</Title>
            </Link>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content className="search-page-content">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            className="error-alert"
          />
        )}

        {/* Search Header */}
        <section className="search-section">
          <Title level={2} className="search-title">Search Brands</Title>
          <Row gutter={16} justify="center" className="search-input-container">
            <Col xs={24} sm={16} md={12}>
              <Input
                placeholder="Search by name or tag..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                prefix={<SearchOutlined />}
                suffix={
                  searchLoading ? (
                    <LoadingOutlined spin />
                  ) : (
                    brandSearch && (
                      <ClearOutlined
                        onClick={() => setBrandSearch('')}
                        style={{ cursor: 'pointer' }}
                      />
                    )
                  )
                }
                onPressEnter={handleSearch}
              />
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                loading={searchLoading}
                disabled={!brandSearch.trim() && selectedCategories.length === 0}
                onClick={handleSearch}
                className="search-button"
              >
                Search
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                disabled={!brandSearch && selectedCategories.length === 0}
                className="clear-button"
              >
                Clear
              </Button>
            </Col>
          </Row>
        </section>

        {/* Tags Section */}
        <section className="tags-section">
          <Title level={3} className="tags-title">Filter by Categories</Title>
          <div className="tags-container">
            <div className="categories-scroll">
              {categories.length > 0 && colorCacheReady ? (
                <>
                  {/* Original categories */}
                  {categories.map((category, index) => {
                    const catName = category.name || category;
                    const isSelected = selectedCategories.includes(catName);
                    const tagColor = getCachedCategoryColor(catName) || '#d9d9d9';

                    return (
                      <div
                        key={index}
                        className="category-item"
                        onClick={() => handleTagClick(catName)}
                      >
                        <Tag
                          className={`category-tag ${isSelected ? 'category-tag-selected' : ''}`}
                          style={{
                            backgroundColor: isSelected ? tagColor : `${tagColor}20`,
                            border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
                            color: isSelected ? '#000' : '#333'
                          }}
                        >
                          {catName}
                        </Tag>
                      </div>
                    );
                  })}

                  {/* Duplicated categories for infinite scroll effect */}
                  {categories.map((category, index) => {
                    const catName = category.name || category;
                    const isSelected = selectedCategories.includes(catName);
                    const tagColor = getCachedCategoryColor(catName) || '#d9d9d9';

                    return (
                      <div
                        key={`dup-${index}`}
                        className="category-item"
                        onClick={() => handleTagClick(catName)}
                      >
                        <Tag
                          className={`category-tag ${isSelected ? 'category-tag-selected' : ''}`}
                          style={{
                            backgroundColor: isSelected ? tagColor : `${tagColor}20`,
                            border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
                            color: isSelected ? '#000' : '#333'
                          }}
                        >
                          {catName}
                        </Tag>
                      </div>
                    );
                  })}
                </>
              ) : (
                <Spin size="small" />
              )}
            </div>
          </div>

          {/* Selected tags */}
          {selectedCategories.length > 0 && (
            <div className="selected-filters-container">
              <Typography.Text className="selected-filter-label">Selected filters: </Typography.Text>
              {selectedCategories.map((category, index) => {
                const tagColor = getCachedCategoryColor(category) || '#d9d9d9';
                return (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleTagClick(category)}
                    className="selected-tag"
                    style={{
                      backgroundColor: tagColor,
                      border: `2px solid ${tagColor}`,
                      color: '#000'
                    }}
                  >
                    {category}
                  </Tag>
                );
              })}
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="results-section">
          <Row justify="space-between" align="middle" className="results-header">
            <Col>
              <Title level={3} className="results-title">
                Search Results
                {filteredBrands.length > 0 && (
                  <Typography.Text type="secondary" className="results-count">
                    ({filteredBrands.length} brand{filteredBrands.length !== 1 ? 's' : ''} found)
                  </Typography.Text>
                )}
              </Title>
            </Col>
            {searchLoading && (
              <Col>
                <Spin size="small" />
              </Col>
            )}
          </Row>

          {filteredBrands.length > 0 ? (
            <Row gutter={[16, 16]} justify="start">
              {filteredBrands.map((brand) => (
                <Col xs={24} sm={12} md={12} lg={8} key={brand.id}>
                  <div className="featured-brand-card">
                    <Link to={`/brands/${brand.id}`}>
                      <BrandCard brand={brand} onTagClick={handleTagClick} />
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
          ) : !searchLoading ? (
            <Empty
              description={
                brandSearch || selectedCategories.length > 0
                  ? "No brands match your search criteria"
                  : "Start searching to discover ethical brands"
              }
              className="empty-results"
            />
          ) : null}
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default SearchBrandsPage;
