import React from 'react';

const PaymentMethod = ({ selected, onChange }) => {
  const methods = [
    {
      id: 'razorpay',
      label: 'Razorpay Online Payment (UPI, Cards, NetBanking)',
      icon: '💳',
      badge: 'Recommended',
      description: 'Instant & Secure checkout via Google Pay, PhonePe, Paytm, Credit/Debit Cards, & Netbanking.'
    },
    {
      id: 'cod',
      label: 'Cash on Delivery (COD)',
      icon: '🚚',
      badge: null,
      description: 'Pay in cash when your order arrives at your doorstep. Additional ₹50 handling charge applies.'
    }
  ];

  return (
    <div className="checkout-card">
      <h2 className="checkout-section-title">
        <span className="checkout-section-num">3</span>
        Payment Method
      </h2>

      <div className="payment-options">
        {methods.map(({ id, label, icon, badge, description }) => (
          <div
            key={id}
            className={`payment-option${selected === id ? ' selected' : ''}`}
            onClick={() => onChange(id)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          >
            <div className="payment-option-header d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  id={`pay-${id}`}
                  value={id}
                  checked={selected === id}
                  onChange={() => onChange(id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="payment-option-label mb-0 fw-semibold" htmlFor={`pay-${id}`}>
                  <span className="payment-icon me-2">{icon}</span>
                  {label}
                </label>
              </div>
              {badge && <span className="payment-badge badge bg-primary rounded-pill px-3 py-1 ms-2">{badge}</span>}
            </div>

            {selected === id && (
              <div className="payment-card-fields mt-3 p-3 rounded" style={{ background: '#f8fafc', borderLeft: '4px solid #4f46e5' }}>
                <p style={{ fontSize: '0.9rem', color: '#475569', margin: 0 }}>
                  {description}
                </p>

                {id === 'razorpay' && (
                  <div className="d-flex flex-wrap align-items-center gap-2 mt-3 pt-2 border-top">
                    <span className="badge bg-light text-dark border">GPay</span>
                    <span className="badge bg-light text-dark border">PhonePe</span>
                    <span className="badge bg-light text-dark border">Paytm</span>
                    <span className="badge bg-light text-dark border">Visa / Mastercard</span>
                    <span className="badge bg-light text-dark border">RuPay</span>
                    <span className="badge bg-light text-dark border">NetBanking</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethod;
