import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { getWishlist, saveWishlist, addToCartStore } from "../utils/cartStore";
import { showSuccess, showError } from "../components/common/Toast";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState(() => getWishlist());

  const removeItem = (id) => {
    const updated = wishlistItems.filter((item) => item.id !== id);
    setWishlistItems(updated);
    saveWishlist(updated);
    showSuccess("Product removed from wishlist");
  };

  const moveToCart = (item) => {
    const success = addToCartStore(item);
    if (success) {
      const updated = wishlistItems.filter((i) => i.id !== item.id);
      setWishlistItems(updated);
      saveWishlist(updated);
      showSuccess(`"${item.title}" moved to Cart 🛒`);
    } else {
      showError(`Cannot add "${item.title}" to Cart. Out of stock!`);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-4">
          ❤️ My Wishlist
        </h2>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-5">
            <h4>Your wishlist is empty</h4>
          </div>
        ) : (
          <div className="row">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="col-md-4 mb-4"
              >
                <div className="card shadow h-100 border-0" style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover"
                    }}
                  />

                  <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-bold">{item.title}</h5>
                      <p className="fw-bold text-dark fs-5">
                        ₹{item.price}
                      </p>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-dark w-50 rounded-pill py-2"
                        onClick={() =>
                          moveToCart(item)
                        }
                      >
                        Add To Cart
                      </button>

                      <button
                        className="btn btn-outline-danger w-50 rounded-pill py-2"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Wishlist;