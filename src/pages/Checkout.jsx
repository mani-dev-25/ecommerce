import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import BillingForm from "../components/checkout/BillingForm";
import PaymentMethod from "../components/checkout/PaymentMethod";
import OrderSummary from "../components/checkout/OrderSummary";
import { getCart, saveCart } from "../utils/cartStore";
import { api } from "../utils/api";
import { showSuccess, showError } from "../components/common/Toast";
import "../components/checkout/checkout.css";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function Checkout() {
  const [cartItems, setCartItems] = useState(() => getCart());
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [razorpayPaymentId, setRazorpayPaymentId] = useState("");
  const navigate = useNavigate();

  // Address states
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Error states
  const [billingErrors, setBillingErrors] = useState({});
  const [shippingErrors, setShippingErrors] = useState({});

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("razorpay");

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Calculate prices
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );
  const discount = subtotal > 10000 ? Math.round(subtotal * 0.1) : 0; // 10% discount above 10,000
  const baseDelivery = subtotal > 5000 || subtotal === 0 ? 0 : 99;
  const deliveryCharge = paymentMethod === "cod" ? baseDelivery + 50 : baseDelivery; // extra ₹50 for cash on delivery
  const total = subtotal - discount + deliveryCharge;

  // Change handlers
  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({ ...prev, [name]: value }));
    if (billingErrors[name]) {
      setBillingErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (shippingErrors[name]) {
      setShippingErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Validate Billing
    const bErrors = {};
    if (!billingAddress.firstName.trim()) bErrors.firstName = "First name is required";
    if (!billingAddress.lastName.trim()) bErrors.lastName = "Last name is required";
    if (!billingAddress.email.trim()) {
      bErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(billingAddress.email)) {
      bErrors.email = "Please enter a valid email address";
    }
    if (!billingAddress.phone.trim()) {
      bErrors.phone = "Phone number is required";
    } else if (billingAddress.phone.replace(/\D/g, "").length < 10) {
      bErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!billingAddress.addressLine1.trim()) bErrors.addressLine1 = "Street address is required";
    if (!billingAddress.city.trim()) bErrors.city = "City is required";
    if (!billingAddress.state) bErrors.state = "State selection is required";
    if (!billingAddress.pincode.trim()) {
      bErrors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(billingAddress.pincode.trim())) {
      bErrors.pincode = "Enter a valid 6-digit PIN code";
    }

    setBillingErrors(bErrors);
    if (Object.keys(bErrors).length > 0) isValid = false;

    // Validate Shipping if not same
    if (!sameAsBilling) {
      const sErrors = {};
      if (!shippingAddress.firstName.trim()) sErrors.firstName = "First name is required";
      if (!shippingAddress.lastName.trim()) sErrors.lastName = "Last name is required";
      if (!shippingAddress.email.trim()) {
        sErrors.email = "Email address is required";
      } else if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
        sErrors.email = "Please enter a valid email address";
      }
      if (!shippingAddress.phone.trim()) {
        sErrors.phone = "Phone number is required";
      } else if (shippingAddress.phone.replace(/\D/g, "").length < 10) {
        sErrors.phone = "Enter a valid 10-digit phone number";
      }
      if (!shippingAddress.addressLine1.trim()) sErrors.addressLine1 = "Street address is required";
      if (!shippingAddress.city.trim()) sErrors.city = "City is required";
      if (!shippingAddress.state) sErrors.state = "State selection is required";
      if (!shippingAddress.pincode.trim()) {
        sErrors.pincode = "PIN code is required";
      } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
        sErrors.pincode = "Enter a valid 6-digit PIN code";
      }

      setShippingErrors(sErrors);
      if (Object.keys(sErrors).length > 0) isValid = false;
    }

    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      showError("Please correct the errors in the checkout form");
      return;
    }

    setLoading(true);

    try {
      const addressToUse = sameAsBilling ? billingAddress : shippingAddress;
      const formattedAddress = `${addressToUse.firstName} ${addressToUse.lastName}, ${addressToUse.addressLine1} ${addressToUse.addressLine2}, ${addressToUse.city}, ${addressToUse.state} - ${addressToUse.pincode}`;
      const itemsPayload = cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      if (paymentMethod === "razorpay") {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          showError("Razorpay SDK failed to load. Check your internet connection.");
          setLoading(false);
          return;
        }

        // 1. Create Razorpay order on backend
        const razorpayOrder = await api.createRazorpayOrder(itemsPayload);

        // 2. Open Razorpay Checkout modal
        const options = {
          key: razorpayOrder.keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Vynex Store",
          description: "E-Commerce Purchase Payment",
          order_id: razorpayOrder.id,
          prefill: {
            name: `${addressToUse.firstName} ${addressToUse.lastName}`,
            email: addressToUse.email,
            contact: addressToUse.phone
          },
          theme: {
            color: "#4f46e5"
          },
          handler: async function (response) {
            try {
              setLoading(true);
              const verifyRes = await api.verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: itemsPayload,
                shippingAddress: formattedAddress,
                contactPhone: addressToUse.phone
              });

              setOrderPlaced(true);
              setOrderId(verifyRes._id);
              setRazorpayPaymentId(response.razorpay_payment_id);
              saveCart([]);
              window.dispatchEvent(new Event("cart-updated"));
              showSuccess("Payment successful! Order placed 🎉");
            } catch (err) {
              showError(err.message || "Payment verification failed.");
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              showError("Payment window closed.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          setLoading(false);
          showError(`Payment failed: ${response.error.description || "Transaction declined"}`);
        });
        rzp.open();
      } else {
        // Cash on Delivery
        const orderData = {
          items: itemsPayload,
          shippingAddress: formattedAddress,
          contactPhone: addressToUse.phone,
          paymentMethod: 'cod'
        };

        const res = await api.placeOrder(orderData);
        
        setOrderPlaced(true);
        setOrderId(res._id);
        saveCart([]);
        window.dispatchEvent(new Event('cart-updated'));
        showSuccess("Order placed successfully via COD! 🎉");
      }
    } catch (error) {
      showError(error.message || "Failed to process order.");
    } finally {
      if (paymentMethod !== "razorpay") {
        setLoading(false);
      }
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="container py-5 text-center">
          <div className="checkout-success-card p-5 border rounded shadow-sm mx-auto" style={{ maxWidth: "600px", borderRadius: "20px", background: "#fff" }}>
            <div style={{ fontSize: "5rem", color: "#10b981", animation: "bounce 1s infinite" }}>✓</div>
            <h1 className="fw-bold mb-3 mt-2">Order Successful!</h1>
            <p className="lead text-secondary mb-4">
              Thank you for your order. We are preparing it for shipment.
            </p>
            <div className="bg-light p-4 rounded text-start mb-4" style={{ border: "1px dashed #ccc" }}>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Order ID:</span>
                <span className="fw-bold">{orderId}</span>
              </div>
              {razorpayPaymentId && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Razorpay Payment ID:</span>
                  <span className="fw-bold text-success" style={{ fontFamily: 'monospace' }}>{razorpayPaymentId}</span>
                </div>
              )}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Paid:</span>
                <span className="fw-bold text-primary">₹ {total.toLocaleString('en-IN')}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Payment Mode:</span>
                <span className="fw-bold">{paymentMethod === "razorpay" ? "Razorpay Online Payment" : "Cash on Delivery"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Est. Delivery:</span>
                <span className="fw-bold" style={{ color: "#ff6b00" }}>3 - 5 Business Days</span>
              </div>
            </div>
            <button
              className="btn btn-dark rounded-pill px-5 py-3 w-100 fw-bold"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-5">
        <h1 className="fw-bold mb-5">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🛒</div>
            <h3 className="fw-bold">Your cart is empty</h3>
            <p className="text-muted mb-4">You must add items to your cart before checking out.</p>
            <button className="btn btn-dark rounded-pill px-4 py-2" onClick={() => navigate("/products")}>
              Go to Catalog
            </button>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              {/* Billing Info */}
              <BillingForm
                data={billingAddress}
                onChange={handleBillingChange}
                errors={billingErrors}
                title="Billing Details"
                sectionNum="1"
              />

              {/* Shipping Checkbox */}
              <div className="checkout-card mt-4">
                <div className="form-check d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="sameAsBilling"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    style={{ cursor: "pointer", width: "1.2rem", height: "1.2rem" }}
                  />
                  <label
                    className="form-check-label ms-2 fw-semibold"
                    htmlFor="sameAsBilling"
                    style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  >
                    My Shipping Address is the same as Billing Address
                  </label>
                </div>
              </div>

              {/* Shipping Address Form (rendered conditionally) */}
              {!sameAsBilling && (
                <div className="mt-4">
                  <BillingForm
                    data={shippingAddress}
                    onChange={handleShippingChange}
                    errors={shippingErrors}
                    title="Shipping Details"
                    sectionNum="2"
                  />
                </div>
              )}

              {/* Payment Method */}
              <div className="mt-4">
                <PaymentMethod
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                discount={discount}
                deliveryCharge={deliveryCharge}
                onPlaceOrder={handlePlaceOrder}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Checkout;
