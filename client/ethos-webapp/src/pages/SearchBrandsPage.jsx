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
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#fff', padding: '0 2rem' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title>
            </Col>
            <Col>
              <NavBar />
            </Col>
          </Row>
        </Header>
        <Content style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 2rem' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: '#000' }}>ETHOS</Title>
          </Col>
          <Col>
            <NavBar />
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: '2rem' }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: '2rem' }}
          />
        )}

        {/* Search Header */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Title level={2}>Search Brands</Title>
          <Row gutter={16} justify="center" style={{ marginTop: '1rem' }}>
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
              >
                Search
              </Button>
            </Col>
            <Col>
              <Button
                icon={<ClearOutlined />}
                onClick={handleClear}
                disabled={!brandSearch && selectedCategories.length === 0}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </section>

        {/* Tags Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={3}>Filter by Categories</Title>
          <div style={{ marginTop: '1rem' }}>
            {categories.length > 0 && colorCacheReady ? (
              categories.map((category, index) => {
                const catName = category.name || category;
                const isSelected = selectedCategories.includes(catName);
                const tagColor = getCachedCategoryColor(catName) || '#d9d9d9';

                return (
                  <Tag
                    key={index}
                    onClick={() => handleTagClick(catName)}
                    style={{
                      backgroundColor: isSelected ? tagColor : `${tagColor}20`,
                      border: isSelected ? `2px solid ${tagColor}` : `1px solid ${tagColor}40`,
                      color: isSelected ? '#000' : '#333',
                      fontWeight: isSelected ? 'bold' : 'normal',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '24px'
                    }}
                  >
                    {catName}
                  </Tag>
                );
              })
            ) : (
              <Spin size="small" />
            )}
          </div>

          {/* Selected tags */}
          {selectedCategories.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <Typography.Text strong>Selected filters: </Typography.Text>
              {selectedCategories.map((category, index) => {
                const tagColor = getCachedCategoryColor(category) || '#d9d9d9';
                return (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleTagClick(category)}
                    style={{
                      backgroundColor: tagColor,
                      border: `2px solid ${tagColor}`,
                      color: '#000',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      borderRadius: '24px',
                      padding: '0.3rem 0.75rem',
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
        <section>
          <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
            <Col>
              <Title level={3}>
                Search Results
                {filteredBrands.length > 0 && (
                  <Typography.Text type="secondary" style={{ fontSize: '16px', fontWeight: 'normal' }}>
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
                <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
                  <Link to={`/brands/${brand.id}`} style={{ textDecoration: 'none' }}>
                    <BrandCard brand={brand} onTagClick={handleTagClick} />
                  </Link>
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
              style={{ margin: '2rem 0' }}
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
