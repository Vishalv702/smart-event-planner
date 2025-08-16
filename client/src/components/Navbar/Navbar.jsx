import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar glass-white">
      <div className="navbar-left">
        <h2 className="navbar-title text-gradient-primary">EventEase</h2>
      </div>
      <div className="navbar-right">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/events" className="nav-link">Events</Link>
        <Link to="/login" className="nav-link">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
