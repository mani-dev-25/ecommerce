import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { showSuccess, showError } from '../common/Toast';
import { api } from '../../utils/api';
import './OrdersTable.css';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminOrders(page, 10);
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      showError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-processing';
      default: return '';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus.toLowerCase() });
      
      const updatedOrders = orders.map((order) => {
        if (order._id === orderId) {
          return { ...order, orderStatus: newStatus.toLowerCase() };
        }
        return order;
      });
      
      setOrders(updatedOrders);
      showSuccess(`Order status updated to ${newStatus}`);
    } catch (err) {
      showError(err.message || "Failed to update order status");
    }
  };

  return (
    <div className="orders-table-wrapper">
      <div className="table-header">
        <div>
          <h6 className="table-title">Recent Orders</h6>
          {pagination && <p className="table-subtitle">{pagination.total} orders total</p>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status"></div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">No orders found.</td>
              </tr>
            ) : orders.map((order) => (
              <tr key={order._id}>
                <td className="order-id-cell">{order._id}</td>
                <td>
                  <div className="customer-cell">
                    <span className="customer-name">{order.userId?.name || 'Unknown User'}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="amount-cell">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-3 pb-3 border-top pt-3 px-3">
          <button
            className="btn btn-sm btn-outline-secondary me-2 d-flex align-items-center"
            disabled={!pagination.hasPreviousPage}
            onClick={() => setPage(p => p - 1)}
          >
            <FiChevronLeft className="me-1" /> Prev
          </button>
          <span className="text-muted small mx-2">Page {pagination.page} of {pagination.totalPages}</span>
          <button
            className="btn btn-sm btn-outline-secondary ms-2 d-flex align-items-center"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(p => p + 1)}
          >
            Next <FiChevronRight className="ms-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
