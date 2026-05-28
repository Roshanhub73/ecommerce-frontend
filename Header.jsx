import CartIcon from './CartIcon';
import ProfileDropdown from './ProfileDropdown';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import './shop.css';

export default function Header({ cartCount, isCartLoading, cartError, username, onCartClick, onSearch, onOrdersClick, isAuthenticated, onLoginClick }) {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const cartDisplay =
    isCartLoading ? '...' : cartError ? 'Error' : (cartCount ?? 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="shop-topbar">
      <div className="shop-topbar-inner">
        <div className="brand" aria-label="Store brand">
          <span className="brand-badge" aria-hidden="true" />
          <span>Roshan Store</span>
        </div>

        <div className="shop-search-container">
          <form className="shop-search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="shop-search-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="search-submit-btn" aria-label="Submit search">
                🔍
              </button>
            </div>
          </form>
        </div>

        <div className="shop-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {!isAuthenticated && (
            <button 
              className="login-btn" 
              onClick={onLoginClick || (() => {})}
              aria-label="Login"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EA580C)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                boxShadow: theme === 'light' ? '0 2px 4px rgba(249, 115, 22, 0.3)' : '0 2px 4px rgba(249, 115, 22, 0.4)'
              }}
              title="Login"
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'linear-gradient(135deg, #EA580C, #DC2626)';
                e.target.style.boxShadow = theme === 'light' ? '0 4px 8px rgba(249, 115, 22, 0.4)' : '0 4px 8px rgba(249, 115, 22, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(135deg, #F97316, #EA580C)';
                e.target.style.boxShadow = theme === 'light' ? '0 2px 4px rgba(249, 115, 22, 0.3)' : '0 2px 4px rgba(249, 115, 22, 0.4)';
              }}
            >
              🔐 Login
            </button>
          )}
          
          {isAuthenticated && (
            <button 
              className="orders-btn" 
              onClick={onOrdersClick || (() => {})}
              aria-label="View my orders"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme === 'light' ? '#333' : '#fff'
              }}
              title="My Orders"
            >
              📦
            </button>
          )}
          
          <CartIcon
            count={cartDisplay}
            isLoading={isCartLoading}
            hasError={cartError}
            onClick={onCartClick || (() => {})}
          />
          
          {isAuthenticated && <ProfileDropdown username={username} />}
        </div>
      </div>
    </header>
  );
}
