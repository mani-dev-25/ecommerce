import React from 'react';

import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin
} from 'react-icons/fa';

import { Link } from 'react-router-dom';

import './Footer.css';

const Footer = () => {

  return (

    <footer className="footer-custom text-white pt-5 pb-3">

      <div className="container">

        <div className="row gy-4">

          {/* Brand */}

          <div className="col-lg-4">

            <h2 className="fw-bold">
              Vy<span style={{ color: "#ff6b00" }}>nex</span>
            </h2>

            <p className="text-secondary mt-3">
              Premium Ecommerce UI inspired by modern fashion brands.
            </p>

          </div>


          {/* Links */}

          <div className="col-lg-2">

            <h5>Quick Links</h5>

            <div className="d-flex flex-column gap-2 mt-3">

              <Link to="/" className="footer-link">
                Home
              </Link>

              <Link to="/products" className="footer-link">
                Shop
              </Link>

              <Link to="/login" className="footer-link">
                Login
              </Link>

              <Link to="/register" className="footer-link">
                Register
              </Link>

            </div>

          </div>


          {/* Contact */}

          <div className="col-lg-3">

            <h5>Contact</h5>

            <div className="mt-3 text-secondary">

              <p>Email : support@vynex.com</p>

              <p>Phone : +91 9597334312</p>

              <p>Location : Chennai</p>

            </div>

          </div>


          {/* Newsletter */}

          <div className="col-lg-3">

            <h5>Newsletter</h5>

            <div className="mt-3">

              <input
                type="email"
                placeholder="Enter Email"
                className="form-control newsletter-input mb-3"
              />

              <button className="signup-btn w-100">
                Subscribe
              </button>

            </div>

          </div>

        </div>


        {/* Bottom */}

        <hr className="border-secondary mt-5" />

        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">

          <p className="text-secondary">
            © 2026 Vynex. All Rights Reserved.
          </p>

          <div className="d-flex gap-4">

            <FaInstagram className="social-icon" size={20} />

            <FaFacebook className="social-icon" size={20} />

            <FaTwitter className="social-icon" size={20} />

            <FaLinkedin className="social-icon" size={20} />

          </div>

        </div>

      </div>

    </footer>

  );
};

export default Footer;