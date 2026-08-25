import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaBars,
  FaSearch
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

import MobileMenu from "./MobileMenu";
import { getCart, getWishlist } from "../../utils/cartStore";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/api";

import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(() => 
    getCart().reduce((sum, item) => sum + (item.quantity || 1), 0)
  );
  const [wishlistCount, setWishlistCount] = useState(() => getWishlist().length);

  const navigate = useNavigate();


  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getCart().reduce((sum, item) => sum + (item.quantity || 1), 0));
    };
    const handleWishlistUpdate = () => {
      setWishlistCount(getWishlist().length);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    window.addEventListener("wishlist-updated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!search.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const data = await api.getProductsCustom(`?search=${encodeURIComponent(search.trim())}&limit=5`);
        setSearchResults(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = () => {
    if (!search.trim()) {
      navigate("/products");
      return;
    }
    navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const handleWishlist = () => {
    navigate("/wishlist");
  };

  const handleCart = () => {
    navigate("/cart");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-black sticky-top py-3 shadow">
        <div className="container">

          {/* Logo */}
          <Link
            to="/"
            className="navbar-brand fw-bold fs-2 text-white"
          >
            Vy<span style={{ color: "#ff6b00" }}>nex</span>
          </Link>

          {/* Search */}
          <div className="d-none d-lg-flex position-relative w-50 mx-4">

            <input
              type="text"
              placeholder="Search products..."
              className="form-control rounded-pill ps-5 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => {
                if (search.trim()) setShowDropdown(true);
              }}
              onBlur={() => {
                // Timeout to allow click on dropdown item to register before hiding
                setTimeout(() => setShowDropdown(false), 200);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setShowDropdown(false);
                }
              }}
            />

            <FaSearch
              className="position-absolute"
              style={{
                top: "13px",
                left: "18px",
                color: "#777",
                cursor: "pointer"
              }}
              onClick={() => {
                handleSearch();
                setShowDropdown(false);
              }}
            />

            {/* Live Search Dropdown */}
            {showDropdown && search.trim() !== "" && (
              <div className="search-dropdown">
                {isSearching ? (
                  <div className="search-no-results">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div 
                      key={product.id} 
                      className="search-dropdown-item"
                      onClick={() => {
                        setSearch(product.title);
                        setShowDropdown(false);
                        navigate(`/products?search=${encodeURIComponent(product.title)}`);
                      }}
                    >
                      <img src={product.image} alt={product.title} className="search-item-img" />
                      <div className="search-item-info">
                        <span className="search-item-title">{product.title}</span>
                        <span className="search-item-price">₹{product.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="search-no-results">
                    No products found for "{search}"
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Desktop Menu */}
          <div className="d-none d-lg-flex align-items-center gap-4">

            <Link
              to="/"
              className="nav-link-custom position-relative"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="nav-link-custom position-relative"
            >
              Shop
            </Link>

            <Link
              to="/men"
              className="nav-link-custom position-relative"
            >
              Men
            </Link>

            <Link
              to="/women"
              className="nav-link-custom position-relative"
            >
              Women
            </Link>

          </div>

          {/* Right Icons */}
          <div className="d-none d-lg-flex align-items-center gap-4 ms-4">

            <div className="position-relative" style={{ cursor: "pointer" }} onClick={handleWishlist}>
              <FaHeart
                className="text-white icon-hover"
                size={19}
              />
              {wishlistCount > 0 && (
                <span 
                  className="position-absolute badge rounded-pill bg-danger" 
                  style={{ top: "-10px", right: "-10px", fontSize: "0.6rem", padding: "4px 6px" }}
                >
                  {wishlistCount}
                </span>
              )}
            </div>

            <div className="position-relative" style={{ cursor: "pointer" }} onClick={handleCart}>
              <FaShoppingCart
                className="text-white icon-hover"
                size={19}
              />
              {cartCount > 0 && (
                <span 
                  className="position-absolute badge rounded-pill bg-danger" 
                  style={{ top: "-10px", right: "-10px", fontSize: "0.6rem", padding: "4px 6px" }}
                >
                  {cartCount}
                </span>
              )}
            </div>

            <div className="d-flex align-items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-white-50 small d-none d-xl-inline">
                    Hello, <strong className="text-white">{user?.name}</strong>
                  </span>
                  {isAdmin && (
                    <Link to="/admin/dashboard">
                      <button className="signup-btn" style={{ background: '#ff6b00', border: 'none' }}>
                        Admin
                      </button>
                    </Link>
                  )}
                  <button onClick={logout} className="login-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="login-btn">
                      Login
                    </button>
                  </Link>

                  <Link to="/register">
                    <button className="signup-btn">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div
            className="d-lg-none text-white"
            onClick={() => setMenuOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <FaBars size={24} />
          </div>

        </div>
      </nav>

      <MobileMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    </>
  );
};

export default Navbar;