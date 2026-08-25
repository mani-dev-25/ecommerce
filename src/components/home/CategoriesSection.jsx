import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import './CategoriesSection.css';

const categoryImages = {
  'Men': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
  'Women': 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80',
  'Sports': 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=600&auto=format&fit=crop&q=80'
};

const defaultImage = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80';

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Navigate to shop/products page with query filter
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center text-white">
        <div className="spinner-border text-orange" role="status">
          <span className="visually-hidden">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="categories-section py-5">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex align-items-end justify-content-between mb-4 border-bottom pb-3 border-dark">
          <div>
            <span className="category-subtitle text-orange text-uppercase">// Shop by Category</span>
            <h2 className="category-title text-uppercase fw-bold m-0 text-white">Curated Collections</h2>
          </div>
          <span className="text-white-50 small d-none d-md-block">Select a collection to filter shop catalog</span>
        </div>

        {/* Categories Grid */}
        <div className="row g-4 justify-content-center">
          {categories.map((cat) => {
            const bgImage = categoryImages[cat.name] || defaultImage;
            return (
              <div key={cat.name} className="col-lg-3 col-sm-6 d-flex align-items-stretch">
                <div 
                  className="category-card w-100"
                  style={{ backgroundImage: `url(${bgImage})` }}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-card-overlay"></div>
                  
                  <div className="category-card-content text-start">
                    <span className="product-count text-orange fw-bold">
                      {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                    </span>
                    <h3 className="category-card-name text-white text-uppercase m-0 fw-bold">
                      {cat.name}
                    </h3>
                  </div>
                  
                  <div className="category-card-arrow">
                    <span className="arrow-icon">&rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
