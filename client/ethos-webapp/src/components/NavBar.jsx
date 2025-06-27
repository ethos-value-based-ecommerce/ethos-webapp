import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
      <nav className='navigation-bar'>
              <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/login'>Login</Link></li>
                <li><Link to='/categories'>Categories</Link></li>
                <li><Link to='/search-brands'>Search Brands</Link></li>
                <li><Link to='/products'>Search Products</Link></li>
                <li><Link to='/account'>Account</Link></li>
              </ul>
     </nav>
    )

};

export default NavBar;
