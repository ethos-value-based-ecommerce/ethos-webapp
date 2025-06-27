import React, { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import BrandCard from '../components/BrandCard.jsx';
import Footer from '../components/Footer.jsx';

const SearchBrandsPage = ({ brands, topTags }) => {
  const [brandSearch, setBrandSearch] = useState('');
  const [filteredBrands, setFilteredBrands] = useState(brands);

  // Function to handle search
  const handleSearch = () => {
    const results = brands.filter((brand) =>
      brand.name.toLowerCase().includes(brandSearch.toLowerCase())
    );
    setFilteredBrands(results);
  };

  // Funciton to handle clearing search
  const handleClear = () => {
    setBrandSearch('');
    setFilteredBrands(brands);
  };

  // TO DO: FIX FILTERING BY TAGS
  const handleTagClick = (tag) => {
    setBrandSearch(tag);
    const results = brands.filter((brand) =>
      brand.name.toLowerCase().includes(tag.toLowerCase())
    );
    setFilteredBrands(results);
  };
  
  return (
    <main className='search-brands-page'>
      <NavBar />
      <section className='search-brand-header'>
        <h1>Search Brands</h1>
        <form>
          <label htmlFor='brand-search'>Search by name or tag:</label>
          <input
            id='brand-search'
            type='text'
            value={brandSearch}
            onChange={(e) => setBrandSearch(e.target.value)}
            placeholder='Search brands...'
          />
          <button type="button" onClick={handleSearch}>Search</button>
          <button type="button" onClick={handleClear}>Clear</button>
        </form>
      </section>

      <section className='search-brand-tags'>
        <h2 className='tags-heading'>Top Ethos Tags</h2>
        <ul className='top-tag-list'>
          {topTags.slice(0, 10).map((tag, index) => (
            <li key={index}>
              <button onClick={() => handleTagClick(tag)}>{tag}</button>
            </li>
          ))}
        </ul>
      </section>

      <section className='search-brand-results'>
        <h2 className='results-heading'>Search Results</h2>
        {filteredBrands.length > 0 ? (
          <ul>
            {filteredBrands.map((brand) => (
              <li key={brand.id}>
                <BrandCard key={brand.id} brand={brand} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No brands matching your search.</p>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default SearchBrandsPage;
