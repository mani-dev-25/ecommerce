import React from "react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import "./cart.css";

function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.image || "https://via.placeholder.com/150"}
          alt={item.title}
        />
      </div>

      <div className="cart-item-details flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <h4 className="fw-bold m-0">{item.title || "Product Name"}</h4>
          <button
            className="btn btn-link text-danger p-0 ms-2"
            onClick={onRemove}
            title="Remove from Cart"
          >
            <FaTrash size={16} />
          </button>
        </div>

        <p className="cart-price mt-1">
          ₹ {item.price || 999}
        </p>

        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
          {item.size && (
            <span style={{ fontSize: "0.85rem", color: "#666" }}>
              Size: <strong>{item.size}</strong>
            </span>
          )}

          <div className="cart-quantity d-flex align-items-center border rounded">
            <button
              className="btn btn-sm border-0 px-2 py-1"
              onClick={onDecrease}
              disabled={item.quantity <= 1}
            >
              <FaMinus size={10} />
            </button>

            <span className="px-3 fw-bold" style={{ fontSize: "0.9rem" }}>{item.quantity}</span>

            <button
              className="btn btn-sm border-0 px-2 py-1"
              onClick={onIncrease}
            >
              <FaPlus size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;