import React,  { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {Layout, Typography, Input, Button, Row, Col, Tag} from 'antd';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';

// Importing category color for tag colors
import { getCategoryColor } from '../components/categoryColors.jsx';
import '../App.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;


// Function to handle the Search Brands Page
const SearchBrandsPage = ({ brands, topTags }) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [filteredBrands, setFilteredBrands] = useState(brands);
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState([]);

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
    if (newSelectedCategories.length === 0) {
      setFilteredBrands(brands);
    } else {
      const results = brands.filter(
        (brand) =>
          brand.categories &&
          newSelectedCategories.every(
            selectedCat => brand.categories.some(
              category => category.toLowerCase() === selectedCat.toLowerCase()
            )
          )
      );
      setFilteredBrands(results);
    }
  };

  // Check for selectedCategory from navigation state and filter
  useEffect(() => {
    if (location.state?.selectedCategory) {
      const category = location.state.selectedCategory;
      setSelectedCategories([category]);
      handleTagClick(category);
    }
  }, [location.state, brands]);

// Function to handle search
  const handleSearch = () => {
    const lowerSearch = brandSearch.toLowerCase().trim();
    const results = brands.filter(
      (brand) =>
        brand.name.toLowerCase().includes(lowerSearch) ||
        (brand.categories &&
          brand.categories.some((cat) =>
            cat.toLowerCase().includes(lowerSearch)
          ))
    );
    setFilteredBrands(results);
  };

  // Function to handle clearing search
  const handleClear = () => {
    setBrandSearch('');
    setFilteredBrands(brands);
    setSelectedCategories([]);
  };

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
        {/* Search Header */}
        <section style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <Title level={2}>Search Brands</Title>
          <Row gutter={16} justify="center" style={{ marginTop: '1rem' }}>
            <Col xs={24} sm={16} md={12}>
              <Input
                placeholder="Search by name or tag..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
              />
            </Col>
            <Col>
              <Button type="primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
            <Col>
              <Button onClick={handleClear}>Clear</Button>
            </Col>
          </Row>
        </section>

        {/* Tag Section */}
        <section style={{ marginBottom: '2rem' }}>
          <Title level={3}>Top Ethos Tags</Title>
          <div style={{ marginTop: '1rem' }}>
            {topTags.slice(0, 10).map((tag, index) => (
              <Tag
                key={index}
                color={getCategoryColor(tag)}
                style={{
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: selectedCategories.includes(tag) ? 'bold' : 'normal',
                  border: selectedCategories.includes(tag) ? '2px solid' : '1px solid transparent',
                  transform: selectedCategories.includes(tag) ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </section>

        {/* Results Section */}
        <section>
          <Title level={3}>Search Results</Title>
          {filteredBrands.length > 0 ? (
            <Row gutter={[16, 16]} justify="space-around">
              {filteredBrands.map((brand) => (
                <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
                  <Link to={`/brands/${brand.id}`}>
                    <BrandCard brand={brand} />
                  </Link>
                </Col>
              ))}
            </Row>
          ) : (
            <p>No brands matching your search.</p>
          )}
        </section>
      </Content>

      <AntFooter style={{ padding: 0 }}>
        <Footer />
      </AntFooter>
    </Layout>
  );
};

export default SearchBrandsPage;
