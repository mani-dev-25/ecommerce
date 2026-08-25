import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { getCart, saveCart } from "../utils/cartStore";
import { showSuccess, showError } from "../components/common/Toast";
import "../components/cart/cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState(() => getCart());
  const navigate = useNavigate();

  const handleIncrease = (id) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const stockLimit = item.stock !== undefined ? item.stock : 999;
        if ((item.quantity || 1) < stockLimit) {
          return { ...item, quantity: (item.quantity || 1) + 1 };
        } else {
          showError(`Only ${stockLimit} items available in stock`);
          return item;
        }
      }
      return item;
    });
    setCartItems(updated);
    saveCart(updated);
  };

  const handleDecrease = (id) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    saveCart(updated);
  };

  const handleRemove = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
    showSuccess("Product removed from Cart 🛒");
  };

  const handleCheckout = () => {
    showSuccess("Redirecting to checkout page...");
    navigate("/checkout");
  };

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="fw-bold mb-5">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h3 className="fw-bold">Your Cart is empty</h3>
            <p className="text-muted mb-4">Add some beautiful products to start shopping!</p>
            <button className="btn btn-dark rounded-pill px-4 py-2" onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={() => handleIncrease(item.id)}
                    onDecrease={() => handleDecrease(item.id)}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </div>
            </div>

            <div className="col-lg-4">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Cart;
