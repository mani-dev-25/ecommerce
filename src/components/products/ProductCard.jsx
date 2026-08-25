import React from "react";
import "./products.css";
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import { addToCartStore, addToWishlistStore } from "../../utils/cartStore";
import { showSuccess, showInfo, showError } from "../common/Toast";

function ProductCard({ product }) {
  const addToWishlist = () => {
    const added = addToWishlistStore(product);
    if (added) {
      showSuccess(`"${product.title}" added to Wishlist ❤️`);
    } else {
      showInfo(`"${product.title}" is already in your Wishlist!`);
    }
  };

  const addToCart = () => {
    const added = addToCartStore(product);
    if (added) {
      showSuccess(`"${product.title}" added to Cart 🛒`);
    } else {
      showError(`Cannot add "${product.title}" to Cart. Out of stock!`);
    }
  };

  return (
    <div className="card h-100 shadow border-0 product-card">
      {/* Discount Badge */}
      <span className="badge bg-dark position-absolute m-2">
        -{product.discount}%
      </span>

      {/* Wishlist Icon */}
      <button
        className="btn wishlist-btn"
        onClick={addToWishlist}
      >
        <FaHeart />
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.title}
        className="card-img-top product-image"
      />

      <div className="card-body d-flex flex-column">
        {/* Product Title */}
        <h5 className="card-title">
          {product.title}
        </h5>

        {/* Ratings */}
        <div className="text-warning mb-2">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />

          <span className="text-dark ms-2">
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="fw-bold fs-4">
            ₹{product.price}
          </span>

          <span className="text-muted text-decoration-line-through ms-2">
            ₹{product.oldPrice}
          </span>
        </div>

        {/* Add To Cart */}
        <button
          className="btn btn-dark mt-auto"
          onClick={addToCart}
          disabled={product.stock === 0}
        >
          <FaShoppingCart className="me-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;