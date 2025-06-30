import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Layout, Typography, Input, Button, Row, Col, Tag} from 'antd';

import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';
import '../App.css';

const { Title } = Typography;
const { Header, Content, Footer: AntFooter } = Layout;


// Function to handle the Search Brands Page
const SearchBrandsPage = ({ brands, topTags }) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [filteredBrands, setFilteredBrands] = useState(brands);

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
  };

  // Function to handle filtering by categories
  const handleTagClick = (tag) => {
    const results = brands.filter(
      (brand) =>
        brand.categories &&
        brand.categories.some(
          (category) => category.toLowerCase() === tag.toLowerCase()
        )
    );
    setFilteredBrands(results);
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
                color="cyan"
                style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
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
            <Row gutter={[16, 16]}>
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
