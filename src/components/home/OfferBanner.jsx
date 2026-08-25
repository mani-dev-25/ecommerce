import React from 'react';
import { Link } from 'react-router-dom';
import './OfferBanner.css';

const OfferBanner = () => {
  return (
    <section className="offer-banner-section py-5">
      <div className="container">
        <div className="offer-banner-container bg-black text-white p-5 d-flex flex-column flex-lg-row align-items-center justify-content-between position-relative border border-orange">
          <div className="text-start mb-4 mb-lg-0">
            <span className="offer-tag text-uppercase text-orange">// Limited Time Promotion</span>
            <h2 className="offer-title text-uppercase fw-black my-2">
              Save Extra 20% On Footwear
            </h2>
            <p className="offer-description text-white-50 m-0">
              Apply code <strong className="text-white">VYNEX20</strong> at checkout. Valid on all sneakers and training boots.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link to="/products" className="btn-vynex-orange text-uppercase">
              Shop Footwear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
