import React from 'react'
import './navbar-styles.scss';

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src="images/fifa-logo.svg" alt="logo" />
      <h4>Soccer Trainer v{process.env.REACT_APP_VERSION}</h4>
    </nav>
  )
}

export default Navbar;
