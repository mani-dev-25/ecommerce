import React from 'react';
import { FiSearch, FiBell, FiMenu, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const Topbar = ({ onMenuToggle }) => {
  const { user } = useAuth();
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'A';
  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <button className="topbar-menu-toggle d-lg-none" onClick={onMenuToggle}>
          <FiMenu />
        </button>
        <div className="topbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, orders, users..."
            className="search-input"
          />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-icon-btn notification-btn">
          <FiBell />
        </button>

        <div className="topbar-divider"></div>

        <div className="topbar-profile">
          <div className="profile-avatar">
            <span>{firstLetter}</span>
          </div>
          <div className="profile-info d-none d-md-block">
            <span className="profile-name">{user?.name || 'Admin User'}</span>
            <span className="profile-role">{user?.role === 'admin' ? 'Administrator' : 'User'}</span>
          </div>
          <FiChevronDown className="profile-arrow d-none d-md-block" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
