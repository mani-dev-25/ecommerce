import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import { addToCartStore } from '../../utils/cartStore';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts(1, 4);
        setProducts(data.products);
      } catch (err) {
        console.error('Error loading featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    const added = addToCartStore(product);
    if (added) {
      toast.success(`${product.title} added to cart!`);
    } else {
      toast.error(`Cannot add ${product.title} to Cart. Out of stock!`);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="featured-products-section py-5">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex align-items-end justify-content-between mb-4 border-bottom pb-3 border-dark">
          <div>
            <span className="products-subtitle text-orange text-uppercase">// Trending Now</span>
            <h2 className="products-title text-uppercase fw-bold m-0 text-white">Featured Products</h2>
          </div>
          <Link to="/products" className="btn-vynex-link text-uppercase text-decoration-none">
            View All Products &rarr;
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-lg-3 col-sm-6 d-flex align-items-stretch">
              <div className="product-premium-card w-100 d-flex flex-column justify-content-between">
                
                {/* Image Container */}
                <div className="card-img-wrapper position-relative">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-card-img"
                  />
                  {product.discount > 0 && (
                    <span className="badge-discount position-absolute text-uppercase">
                      -{product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="card-details-wrapper p-3 d-flex flex-column justify-content-between flex-grow-1">
                  <div className="text-start mb-3">
                    <span className="product-category-label text-white-50 text-uppercase small">
                      {product.category}
                    </span>
                    <h4 className="product-card-title text-white text-uppercase m-0 mt-1 fw-bold">
                      {product.title}
                    </h4>
                    <div className="product-rating-stars mt-1">
                      <span className="text-warning">★</span> {product.rating}
                    </div>
                  </div>

                  {/* Price & Cart Actions */}
                  <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-dark">
                    <div className="text-start">
                      {product.oldPrice && (
                        <span className="old-price text-white-50 text-decoration-line-through me-2 small">
                          ₹{product.oldPrice}
                        </span>
                      )}
                      <span className="current-price text-orange fw-bold">
                        ₹{product.price}
                      </span>
                    </div>
                    
                    <button 
                      className="btn-add-cart-minimal"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : '+ Add'}
                    </button>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
