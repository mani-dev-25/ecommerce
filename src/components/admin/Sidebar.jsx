import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiX,
  FiChevronRight,
} from 'react-icons/fi';
import './Sidebar.css';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid />, path: '/admin/dashboard' },
  { id: 'products', label: 'Products', icon: <FiBox />, path: '/admin/products' },
  { id: 'orders', label: 'Orders', icon: <FiShoppingCart />, path: '/admin/orders' },
  { id: 'users', label: 'Users', icon: <FiUsers />, path: '/admin/users' },
  { id: 'settings', label: 'Settings', icon: <FiSettings />, path: '/admin/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active item based on current URL path
  const currentPath = location.pathname;
  const activeMenu = menuItems.find(item => currentPath.startsWith(item.path))?.id || 'dashboard';

  const handleMenuClick = (item) => {
    navigate(item.path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    navigate('/');
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-icon">⚡</span>
            <span className="brand-text">ShopAdmin</span>
          </div>
          <button className="sidebar-close-btn d-lg-none" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">MENU</span>
            <ul className="sidebar-menu">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`sidebar-menu-item ${activeMenu === item.id ? 'active' : ''}`}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                    <FiChevronRight className="menu-arrow" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-menu-item logout-btn" onClick={handleLogout}>
            <span className="menu-icon"><FiLogOut /></span>
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
