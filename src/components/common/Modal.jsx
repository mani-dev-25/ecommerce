import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

const Modal = ({
  show = false,
  onClose,
  title = '',
  children,
  size = 'md',
  footer,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className="custom-modal-overlay" onClick={handleOverlayClick}>
      <div className={`custom-modal custom-modal-${size}`}>
        <div className="custom-modal-header">
          <h5 className="custom-modal-title">{title}</h5>
          <button className="custom-modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="custom-modal-body">{children}</div>
        {footer && <div className="custom-modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
