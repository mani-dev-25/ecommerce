import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loader.css';


// Inline spinner loader
export const SpinnerLoader = ({
  size = 'md',
  color = '#ff6b00'
}) => {

  const sizeMap = {
    sm: '1.2rem',
    md: '2rem',
    lg: '3rem'
  };

  return (
    <div className="spinner-loader">
      <Spinner
        animation="border"
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          color: color,
          borderWidth: size === 'sm' ? '2px' : '3px',
        }}
      />
    </div>
  );
};


// Full-page overlay loader
export const FullPageLoader = ({
  text = 'Loading Dashboard...'
}) => {

  return (
    <div className="full-page-loader">

      <div className="loader-content">

        <div className="loader-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>

          {/* Lightning Icon */}
          <span className="loader-icon">⚡</span>
        </div>

        <p className="loader-text">{text}</p>

        {/* 3 Dots */}
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>

    </div>
  );
};


// Button loader (inline small)
export const ButtonLoader = ({
  color = '#ffffff'
}) => {

  return (
    <span className="button-loader">
      <span className="dot" style={{ background: color }}></span>
      <span className="dot" style={{ background: color }}></span>
      <span className="dot" style={{ background: color }}></span>
    </span>
  );
};