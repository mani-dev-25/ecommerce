import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { api } from "../utils/api";
import { showError } from "../components/common/Toast";
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaTimesCircle } from "react-icons/fa";
import "./Orders.css";

const STEPS = [
  { key: "pending", label: "Order Placed", icon: FaClock },
  { key: "processing", label: "Processing", icon: FaBox },
  { key: "shipped", label: "Shipped", icon: FaTruck },
  { key: "delivered", label: "Delivered", icon: FaCheckCircle },
];

function getStatusStepIndex(status) {
  switch (status) {
    case "pending": return 0;
    case "processing": return 1;
    case "shipped": return 2;
    case "delivered": return 3;
    default: return 0;
  }
}

function calculateEstimatedDelivery(createdAt, status) {
  const createdDate = new Date(createdAt);
  
  if (status === "delivered") {
    return `Delivered on ${createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  
  const minDelivery = new Date(createdDate);
  minDelivery.setDate(createdDate.getDate() + 3);
  
  const maxDelivery = new Date(createdDate);
  maxDelivery.setDate(createdDate.getDate() + 5);

  const minStr = minDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const maxStr = maxDelivery.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return `${minStr} - ${maxStr}`;
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const data = await api.getUserOrders(pageNumber, 10);
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (err) {
      showError(err.message || "Failed to load order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  return (
    <Layout>
      <div className="orders-page-container py-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h1 className="orders-header-title mb-1">My Orders</h1>
              <p className="text-secondary mb-0">Track your shipments, view order details, and check delivery status.</p>
            </div>
            <button className="btn btn-outline-dark rounded-pill px-4" onClick={() => fetchOrders(page)}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading orders...</span>
              </div>
              <p className="mt-3 text-secondary">Fetching your order history...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border p-5 mx-auto" style={{ maxWidth: "600px" }}>
              <div style={{ fontSize: "4.5rem", marginBottom: "1rem" }}>📦</div>
              <h3 className="fw-bold mb-2">No Orders Placed Yet</h3>
              <p className="text-muted mb-4">Looks like you haven't bought anything from Vynex yet.</p>
              <button className="btn btn-dark rounded-pill px-5 py-2 fw-semibold" onClick={() => navigate("/products")}>
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {orders.map((order) => {
                const currentStepIdx = getStatusStepIndex(order.orderStatus);
                const isCancelled = order.orderStatus === "cancelled";
                const estDelivery = calculateEstimatedDelivery(order.createdAt, order.orderStatus);
                const progressWidth = isCancelled ? 0 : (currentStepIdx / (STEPS.length - 1)) * 100;

                return (
                  <div key={order._id} className="order-card">
                    {/* Header */}
                    <div className="order-card-header d-flex flex-wrap align-items-center justify-content-between gap-3">
                      <div>
                        <span className="text-muted small">Order ID:</span>{" "}
                        <span className="order-id-code">{order._id}</span>
                        <div className="text-secondary small mt-1">
                          Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        {/* Payment Method Badge */}
                        <span className={`badge rounded-pill ${order.paymentMethod === 'razorpay' ? 'badge-razorpay' : 'badge-cod'} px-3 py-2`}>
                          <FaCreditCard className="me-1" />
                          {order.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'Cash on Delivery'}
                        </span>

                        {/* Payment Status Badge */}
                        <span className={`badge rounded-pill px-3 py-2 ${
                          order.paymentStatus === 'paid' ? 'bg-success' :
                          order.paymentStatus === 'failed' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {order.paymentStatus === 'paid' ? 'Paid ✓' : order.paymentStatus === 'failed' ? 'Failed ✗' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Delivery Status Banner */}
                      <div className="delivery-estimate-banner d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                        <div className="d-flex align-items-center gap-2">
                          <FaCalendarAlt className="text-primary fs-5" />
                          <div>
                            <span className="fw-semibold text-dark me-2">Estimated Delivery:</span>
                            <span className="fw-bold text-primary">{estDelivery}</span>
                          </div>
                        </div>
                        <div className="badge bg-white text-dark border px-3 py-2">
                          Status: <strong className="text-capitalize text-indigo">{order.orderStatus}</strong>
                        </div>
                      </div>

                      {/* Shipment Tracking Progress Stepper */}
                      {!isCancelled ? (
                        <div className="stepper-container">
                          <div className="stepper-line-bg"></div>
                          <div
                            className="stepper-line-progress"
                            style={{ width: `${progressWidth}%` }}
                          ></div>
                          {STEPS.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isCompleted = idx <= currentStepIdx;
                            const isActive = idx === currentStepIdx;

                            return (
                              <div
                                key={step.key}
                                className={`stepper-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
                              >
                                <div className="stepper-icon-circle">
                                  <StepIcon />
                                </div>
                                <span className="stepper-label">{step.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 my-3">
                          <FaTimesCircle className="fs-4" />
                          <div>
                            <strong>Order Cancelled</strong> - This order was cancelled.
                          </div>
                        </div>
                      )}

                      {/* Items breakdown */}
                      <div className="mt-4 pt-3 border-top">
                        <h6 className="fw-bold mb-3">Items Purchased ({order.items.length})</h6>
                        <div className="d-flex flex-column gap-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded bg-light">
                              <div className="d-flex align-items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.title} className="order-item-img" />
                                ) : (
                                  <div className="order-item-img bg-secondary text-white d-flex align-items-center justify-content-center fw-bold">
                                    IMG
                                  </div>
                                )}
                                <div>
                                  <div className="order-item-title">{item.title}</div>
                                  <div className="order-item-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                                </div>
                              </div>
                              <div className="fw-bold text-dark me-2">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address & Total Footer */}
                      <div className="row g-3 mt-3 pt-3 border-top align-items-center">
                        <div className="col-md-7">
                          <div className="d-flex align-items-start gap-2 text-secondary small">
                            <FaMapMarkerAlt className="mt-1 text-danger flex-shrink-0" />
                            <div>
                              <strong className="text-dark">Shipping Address:</strong><br />
                              {order.shippingAddress}<br />
                              <span className="text-muted">Contact: {order.contactPhone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-5 text-md-end">
                          <span className="text-muted small">Total Paid: </span>
                          <span className="fs-4 fw-bold text-primary ms-2">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                  <button
                    className="btn btn-outline-dark rounded-pill px-4"
                    disabled={!pagination.hasPreviousPage}
                    onClick={() => setPage(prev => prev - 1)}
                  >
                    Previous
                  </button>
                  <span className="fw-semibold text-secondary">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    className="btn btn-outline-dark rounded-pill px-4"
                    disabled={!pagination.hasNextPage}
                    onClick={() => setPage(prev => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Orders;
