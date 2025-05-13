import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, logout, isAdmin, isWorker } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar bg-primary-navbar text-navbar-text">
      <div className="navbar-container max-w-7xl mx-auto px-4">
        <div className="navbar-main flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="navbar-logo text-2xl font-bold">
            DEADMENALIVE
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links hidden md:flex items-center space-x-8">
            <Link to="/" className="navbar-link hover:text-navbar-link-hover">
              Home
            </Link>
            <button 
              onClick={() => scrollToSection('featured')}
              className="navbar-link hover:text-navbar-link-hover"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection('footer-section')}
              className="navbar-link hover:text-navbar-link-hover"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('footer-section')}
              className="navbar-link hover:text-navbar-link-hover"
            >
              Contact
            </button>
          </div>

          {/* Right Side Icons */}
          <div className="navbar-icons flex items-center space-x-4">
            <Link to="/cart" className="navbar-cart relative hover:text-navbar-link-hover" aria-label="Cart">
              <FaShoppingCart className="navbar-cart-icon w-5 h-5" />
              {totalItems > 0 && (
                <span className="navbar-cart-badge absolute -top-2 -right-2 bg-white text-primary-navbar text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <button
                className="navbar-user-btn hover:text-navbar-link-hover focus:outline-none"
                tabIndex={0}
                aria-label="User Info"
                onClick={() => {
                  if (user.role && user.role.toLowerCase() === 'admin') {
                    navigate('/admin/dashboard');
                  } else {
                    navigate('/userinfo');
                  }
                }}
              >
                <FaUser className="navbar-user-icon w-5 h-5" />
              </button>
            ) : (
              <Link to="/login" className="navbar-login hover:text-navbar-link-hover" aria-label="Login">
                <FaUser className="navbar-user-icon w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-btn md:hidden hover:text-navbar-link-hover"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="navbar-mobile-icon w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu md:hidden">
            <div className="navbar-mobile-links px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="navbar-mobile-link block px-3 py-2 hover:text-navbar-link-hover"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <button
                onClick={() => {
                  scrollToSection('featured');
                  setIsMenuOpen(false);
                }}
                className="navbar-mobile-link block w-full text-left px-3 py-2 hover:text-navbar-link-hover"
              >
                Shop
              </button>
              <button
                onClick={() => {
                  scrollToSection('footer-section');
                  setIsMenuOpen(false);
                }}
                className="navbar-mobile-link block w-full text-left px-3 py-2 hover:text-navbar-link-hover"
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection('footer-section');
                  setIsMenuOpen(false);
                }}
                className="navbar-mobile-link block w-full text-left px-3 py-2 hover:text-navbar-link-hover"
              >
                Contact
              </button>
              {user && (
                <>
                  <Link
                    to="/account"
                    className="navbar-mobile-link block px-3 py-2 hover:text-navbar-link-hover"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  {(isAdmin() || isWorker()) && (
                    <Link
                      to="/admin/dashboard"
                      className="navbar-mobile-link block px-3 py-2 hover:text-navbar-link-hover"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="navbar-mobile-link block w-full text-left px-3 py-2 hover:text-navbar-link-hover"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;