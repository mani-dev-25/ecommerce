import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  icon,
  error,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const hasError = !!error;

  return (
    <div className={`custom-input-wrapper ${className}`}>
      {label && (
        <label className="custom-input-label" htmlFor={name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div
        className={`custom-input-container ${focused ? 'focused' : ''} ${hasError ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`}
      >
        {icon && <span className="input-icon-left">{icon}</span>}
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="custom-textarea"
            rows={rows}
            disabled={disabled}
            required={required}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        ) : (
          <input
            id={name}
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="custom-input"
            disabled={disabled}
            required={required}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        )}
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      {hasError && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
