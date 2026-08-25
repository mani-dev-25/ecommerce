import React from 'react';

import {
  FaTimes,
  FaShoppingCart,
  FaHeart
} from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import './MobileMenu.css';

const MobileMenu = ({ menuOpen, setMenuOpen }) => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();


  return (

    <>

      {/* Overlay */}

      {
        menuOpen &&

        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      }


      {/* Menu */}

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>

        <div className="d-flex justify-content-between align-items-center mb-5">

          <h3 className="text-white">
            Vy<span style={{ color: "#ff6b00" }}>nex</span>
          </h3>

          <FaTimes
            className="text-white"
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => setMenuOpen(false)}
          />

        </div>


        <div className="d-flex flex-column gap-4">

          <Link
            to="/"
            className="mobile-link text-white"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="mobile-link text-white"
          >
            Shop
          </Link>

          <Link
            to="/products"
            className="mobile-link text-white"
          >
            Men
          </Link>

          <Link
            to="/products"
            className="mobile-link text-white"
          >
            Women
          </Link>


          <div className="d-flex gap-4 mt-3">

            <FaHeart
              className="text-white orange-hover"
              size={22}
            />

            <FaShoppingCart
              className="text-white orange-hover"
              size={22}
            />

          </div>


          {isAuthenticated ? (
            <>
              <div className="text-white mt-4 text-center">
                Hi, <strong className="text-warning">{user?.name}</strong>
              </div>
              {isAdmin && (
                <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                  <button className="mobile-signup-btn mt-3 w-100" style={{ background: '#ff6b00', border: 'none' }}>
                    Admin Panel
                  </button>
                </Link>
              )}
              <button 
                onClick={() => { logout(); setMenuOpen(false); }} 
                className="mobile-login-btn mt-3 w-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button className="mobile-login-btn mt-4 w-100">
                  Login
                </button>
              </Link>

              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <button className="mobile-signup-btn mt-3 w-100">
                  Sign Up
                </button>
              </Link>
            </>
          )}

        </div>

      </div>

    </>

  );
};

export default MobileMenu;