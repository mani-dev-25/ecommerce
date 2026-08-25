import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      {/* Background Image Overlay */}
      <div className="hero-overlay"></div>
      
      <div className="hero-content container text-start">
        <div className="row align-items-center min-vh-100">
          <div className="col-lg-8 col-md-10 text-white">
            {/* Offer Text */}
            <span className="hero-badge text-uppercase mb-3 d-inline-block">
              // Mid-Season Exclusive Offer: Save Up to 40%
            </span>
            
            {/* Main Heading */}
            <h1 className="hero-title text-uppercase fw-black mb-4">
              Step Into <br />
              <span className="text-orange">The Future</span> of Style
            </h1>
            
            {/* Small Description */}
            <p className="hero-description mb-5 text-white-50">
              Experience the pinnacle of premium streetwear and accessories. Crafted for movement, defined by minimalism, and built to stand out.
            </p>
            
            {/* CTA Button */}
            <div className="hero-cta-wrapper">
              <Link to="/products" className="btn-vynex-premium">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
