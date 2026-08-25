import React from 'react';
import { FiLock } from 'react-icons/fi';

const OrderSummary = ({ items, subtotal, discount, deliveryCharge, onPlaceOrder, loading }) => {
  const total = subtotal - discount + deliveryCharge;

  return (
    <div className="order-summary-card">
      <h3 className="order-summary-title">Your Order</h3>

      {/* Items */}
      {items.map((item) => (
        <div className="order-item-row" key={item.id}>
          <img src={item.image} alt={item.title} className="order-item-img" />
          <div className="order-item-info">
            <p className="order-item-name">{item.title}</p>
            <p className="order-item-meta">
              {item.size && `Size: ${item.size}`}{item.size && item.quantity ? ' · ' : ''}Qty: {item.quantity}
            </p>
          </div>
          <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
        </div>
      ))}

      <hr className="order-summary-divider" />

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal.toLocaleString('en-IN')}</span>
      </div>
      <div className="order-summary-row">
        <span>Delivery</span>
        <span>{deliveryCharge === 0
          ? <span style={{ color: '#28a745', fontWeight: 600 }}>FREE</span>
          : `₹${deliveryCharge}`}
        </span>
      </div>
      {discount > 0 && (
        <div className="order-summary-row" style={{ color: '#28a745' }}>
          <span>Discount</span>
          <span>–₹{discount.toLocaleString('en-IN')}</span>
        </div>
      )}

      <div className="order-summary-total">
        <span>Total</span>
        <span>₹{total.toLocaleString('en-IN')}</span>
      </div>

      <button className="btn-place-order" onClick={onPlaceOrder} disabled={loading}>
        <span>{loading ? 'Placing Order…' : 'Place Order'}</span>
      </button>

      <div className="checkout-secure-note">
        <FiLock size={12} /> 256-bit SSL encrypted & secure
      </div>
    </div>
  );
};

export default OrderSummary;
