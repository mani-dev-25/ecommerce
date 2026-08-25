import React, { useState } from 'react';
import { FiCreditCard, FiTruck } from 'react-icons/fi';

const PaymentMethod = ({ selected, onChange, cardData, onCardChange, cardErrors }) => {
  const methods = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', badge: 'Recommended' },
    { id: 'cod',  label: 'Cash on Delivery',    icon: '🚚', badge: null },
  ];

  return (
    <div className="checkout-card">
      <h2 className="checkout-section-title">
        <span className="checkout-section-num">3</span>
        Payment Method
      </h2>

      <div className="payment-options">
        {methods.map(({ id, label, icon, badge }) => (
          <div
            key={id}
            className={`payment-option${selected === id ? ' selected' : ''}`}
            onClick={() => onChange(id)}
          >
            <div className="payment-option-header">
              <input
                type="radio"
                name="paymentMethod"
                id={`pay-${id}`}
                value={id}
                checked={selected === id}
                onChange={() => onChange(id)}
                onClick={(e) => e.stopPropagation()}
              />
              <label className="payment-option-label" htmlFor={`pay-${id}`}>
                <span className="payment-icon">{icon}</span>
                {label}
                {badge && <span className="payment-badge">{badge}</span>}
              </label>
            </div>

            {/* Card fields */}
            {id === 'card' && selected === 'card' && (
              <div className="payment-card-fields">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="checkout-field">
                      <label className="checkout-label">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`checkout-input${cardErrors.cardNumber ? ' is-invalid' : ''}`}
                        value={cardData.cardNumber || ''}
                        onChange={onCardChange}
                      />
                      {cardErrors.cardNumber && <span className="checkout-error">{cardErrors.cardNumber}</span>}
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="checkout-field">
                      <label className="checkout-label">Cardholder Name</label>
                      <input
                        type="text"
                        name="cardName"
                        placeholder="John Doe"
                        className={`checkout-input${cardErrors.cardName ? ' is-invalid' : ''}`}
                        value={cardData.cardName || ''}
                        onChange={onCardChange}
                      />
                      {cardErrors.cardName && <span className="checkout-error">{cardErrors.cardName}</span>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="checkout-field">
                      <label className="checkout-label">Expiry</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM / YY"
                        maxLength={7}
                        className={`checkout-input${cardErrors.expiry ? ' is-invalid' : ''}`}
                        value={cardData.expiry || ''}
                        onChange={onCardChange}
                      />
                      {cardErrors.expiry && <span className="checkout-error">{cardErrors.expiry}</span>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="checkout-field">
                      <label className="checkout-label">CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="•••"
                        maxLength={4}
                        className={`checkout-input${cardErrors.cvv ? ' is-invalid' : ''}`}
                        value={cardData.cvv || ''}
                        onChange={onCardChange}
                      />
                      {cardErrors.cvv && <span className="checkout-error">{cardErrors.cvv}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* COD note */}
            {id === 'cod' && selected === 'cod' && (
              <div className="payment-card-fields">
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Pay in cash when your order arrives. An additional ₹50 handling fee applies.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
