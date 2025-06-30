import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const currentKey = location.pathname;

  const items = [
  { key: 'home', label: <Link to="/">Home</Link> },
  { key: 'login', label: <Link to="/login">Login</Link> },
  { key: 'categories', label: <Link to="/about">Categories</Link> },
  { key: 'brands', label: <Link to="/search-brands">Browse Brands</Link> },
  { key: 'products', label: <Link to="/seach-products">Browse Products</Link>},
  { key: 'contact', label: <Link to="/contact">Account</Link> },
];


  return (
    <Menu
      mode="horizontal"
      theme="light"
      selectedKeys={[currentKey]}
      items={items}
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        borderBottom: 'none',
      }}
    />
  );
};

export default NavBar;

