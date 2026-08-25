import React from "react";
import "./cart.css";

function CartSummary({
  subtotal = 0,
  shipping = 99,
  total = 0,
  onCheckout
}) {
  return (
    <div className="cart-summary">
      <h3 className="fw-bold mb-4">Order Summary</h3>

      <div className="summary-row py-2">
        <span>Subtotal</span>
        <span className="fw-bold">₹ {subtotal.toLocaleString('en-IN')}</span>
      </div>

      <div className="summary-row py-2">
        <span>Shipping</span>
        <span className="fw-bold">{subtotal > 5000 ? "FREE" : `₹ ${shipping}`}</span>
      </div>

      <hr className="my-3" style={{ borderTop: "1px dashed #ddd" }} />

      <div className="summary-row total py-2">
        <span className="fw-bold fs-5">Total</span>
        <span className="fw-bold fs-4 text-primary">
          ₹ {total.toLocaleString('en-IN')}
        </span>
      </div>

      <button className="checkout-btn mt-4 rounded-pill py-3" onClick={onCheckout}>
        Proceed To Checkout
      </button>
    </div>
  );
}

export default CartSummary;