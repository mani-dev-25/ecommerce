import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Button.css';

const Button = ({
  text = 'Button',
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  fullWidth = false,
  ...rest
}) => {
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';

  return (
    <button
      type={type}
      className={`custom-btn custom-btn-${variant} ${sizeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="btn-loading">
          <Spinner animation="border" size="sm" />
          <span className="ms-2">Loading...</span>
        </span>
      ) : (
        <span className="btn-content">
          {icon && iconPosition === 'left' && <span className="btn-icon me-2">{icon}</span>}
          {text && <span>{text}</span>}
          {icon && iconPosition === 'right' && <span className="btn-icon ms-2">{icon}</span>}
        </span>
      )}
    </button>
  );
};

export default Button;
