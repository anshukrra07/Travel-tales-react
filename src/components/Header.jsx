import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initializeAutocomplete } from '../utils/googleMaps';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    const initAutocomplete = () => {
      if (searchInputRef.current && window.google && window.google.maps && window.google.maps.places) {
        initializeAutocomplete(searchInputRef.current, (placeData) => {
          // Clear the search input
          setSearchQuery('');
          
          // Redirect to dynamic destination page with place details
          navigate(
            `/dynamic-destination?name=${encodeURIComponent(placeData.name)}&image=${encodeURIComponent(
              placeData.image
            )}&address=${encodeURIComponent(placeData.address)}&rating=${encodeURIComponent(
              placeData.rating
            )}&lat=${placeData.lat}&lng=${placeData.lng}`
          );
        });
      } else {
        // Retry after a delay if Google Maps isn't ready yet
        setTimeout(initAutocomplete, 500);
      }
    };

    initAutocomplete();
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const openSearchBar = (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-bar');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth' });
      searchInput.focus();
      setShowPrompt(true);
      setTimeout(() => setShowPrompt(false), 3000);
    }
  };

  const redirectToLogin = () => {
    navigate('/login');
  };

  const redirectToAccount = () => {
    navigate('/account');
  };

  return (
    <header>
      <Link to="/" className="logo">
        Tra<span>vel</span> Ta<span>les</span>
      </Link>
      
      <ul className={`navbar ${isMenuOpen ? 'open' : ''}`}>
        <li><Link to="/">home</Link></li>
        <li><a href="#about">about</a></li>
        <li><a href="#destinations">destinations</a></li>
        <li><a href="#tour">tour</a></li>
        <li><a href="#contact">contact</a></li>
        
        {/* Mobile-only login items */}
        {!isLoggedIn && (
          <li className="mobile-login-item">
            <a href="#" className="nav-btn" onClick={redirectToLogin}>Login</a>
          </li>
        )}
        {isLoggedIn && (
          <li className="mobile-login-item">
            <div className="nav-btn" onClick={redirectToAccount}>
              <i className="fa fa-user"></i><h3>User</h3>
            </div>
          </li>
        )}
      </ul>

      <div className="h-right">
        <input
          ref={searchInputRef}
          type="text"
          id="search-bar"
          placeholder=" 🔍 Search places..."
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearchSubmit();
            }
          }}
          className="nav-btn"
        />
        {showPrompt && (
          <div id="search-prompt" className="search-prompt" style={{ opacity: 1 }}>
            Enter your destination to find the best travel options!
          </div>
        )}

        {/* Desktop login/account elements */}
        {!isLoggedIn ? (
          <button id="login-btn" className="desktop-login nav-btn" onClick={redirectToLogin}>
            Login
          </button>
        ) : (
          <div id="account-container" className="desktop-account">
            <div id="user-icon" className="nav-btn" onClick={redirectToAccount}>
              <i className="fa fa-user"></i>
            </div>
          </div>
        )}

        <div className="fa fa-bars navbar-link" id="menu-icon" onClick={toggleMenu}></div>
      </div>
    </header>
  );
};

export default Header;
