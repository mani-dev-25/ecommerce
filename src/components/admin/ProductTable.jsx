import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { showSuccess, showError } from '../common/Toast';
import { api } from '../../utils/api';
import './ProductTable.css';

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: 0,
    image: '',
    category: 'Men',
    size: 'M',
  });

  const [formErrors, setFormErrors] = useState({});

  const loadProducts = async () => {
    setLoading(true);
    try {
      let query = `?page=${page}&limit=10`;
      if (searchTerm) query += `&search=${encodeURIComponent(searchTerm)}`;
      
      const data = await api.getProductsCustom(query);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      showError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const delay = setTimeout(() => {
      loadProducts();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, page]);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: 0,
      image: '',
      category: 'Men',
      size: 'M',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (formData.stock === '' || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newProduct = {
        title: formData.name.trim(),
        category: formData.category,
        size: formData.size,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        rating: 4.5,
      };

      await api.addProduct(newProduct);
      showSuccess(`"${newProduct.title}" added successfully!`);
      setShowAddModal(false);
      resetForm();
      loadProducts();
    } catch (err) {
      showError(err.message || 'Failed to add product');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.title || '',
      price: String(product.price || ''),
      stock: product.stock || 0,
      image: product.image || '',
      category: product.category || 'Men',
      size: product.size || 'M',
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updateData = {
        title: formData.name.trim(),
        category: formData.category,
        size: formData.size,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim() || selectedProduct.image,
      };

      await api.updateProduct(selectedProduct.id, updateData);
      showSuccess(`"${formData.name}" updated successfully!`);
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
      loadProducts();
    } catch (err) {
      showError(err.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        await api.deleteProduct(selectedProduct.id);
        showSuccess(`"${selectedProduct.title}" deleted successfully!`);
        setShowDeleteModal(false);
        setSelectedProduct(null);
        loadProducts();
      } catch (err) {
        showError(err.message || 'Failed to delete product');
      }
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return <span className="stock-badge out-of-stock">Out of Stock</span>;
    if (stock < 20) return <span className="stock-badge low-stock">Low: {stock}</span>;
    return <span className="stock-badge in-stock">In Stock: {stock}</span>;
  };

  return (
    <div className="product-table-wrapper">
      <div className="table-header flex-column flex-md-row">
        <div className="mb-3 mb-md-0">
          <h6 className="table-title">Products</h6>
          {pagination && <p className="table-subtitle">{pagination.total} total products</p>}
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="table-search">
            <FiSearch className="table-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="table-search-input"
            />
          </div>
          <Button
            text="Add Product"
            variant="primary"
            size="sm"
            icon={<FiPlus />}
            onClick={handleAddClick}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
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
            ) : products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-cell">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="product-thumb"
                    />
                    <div className="d-flex flex-column">
                      <span className="product-name">{product.title}</span>
                      <span style={{ fontSize: '0.72rem', color: '#999' }}>Size: {product.size || 'M'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`stock-badge ${product.category === 'Men' ? 'in-stock' : 'low-stock'}`}>
                    {product.category || 'Men'}
                  </span>
                </td>
                <td className="price-cell">{'₹' + Number(product.price || 0).toLocaleString('en-IN')}</td>
                <td>{getStockBadge(product.stock || 0)}</td>
                <td>
                  <div className="action-btns">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditClick(product)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-row">
                  No products found
                </td>
              </tr>
            )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Product"
        size="sm"
        footer={
          <>
            <Button
              text="Cancel"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
            />
            <Button
              text="Delete"
              variant="danger"
              size="sm"
              onClick={handleDelete}
            />
          </>
        }
      >
        <p style={{ margin: 0, color: '#555' }}>
          Are you sure you want to delete <strong>"{selectedProduct?.title}"</strong>? This action cannot be undone.
        </p>
      </Modal>

      {/* Add/Edit Product Modal using same form structure */}
      <Modal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
        size="md"
        footer={
          <>
            <Button text="Cancel" variant="outline" size="sm" onClick={() => setShowAddModal(false)} />
            <Button text="Add Product" variant="primary" size="sm" onClick={handleAddSubmit} />
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" error={formErrors.name} required />
          <div className="row mt-3">
            <div className="col-md-6">
              <Input label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Enter price" error={formErrors.price} required />
            </div>
            <div className="col-md-6">
              <Input label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock" error={formErrors.stock} required />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="custom-input-wrapper">
                <label className="custom-input-label">Category *</label>
                <div className="custom-input-container">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="custom-input border-0 bg-transparent w-100" style={{ outline: 'none' }}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="custom-input-wrapper">
                <label className="custom-input-label">Size *</label>
                <div className="custom-input-container">
                  <select name="size" value={formData.size} onChange={handleInputChange} className="custom-input border-0 bg-transparent w-100" style={{ outline: 'none' }}>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Input label="Image URL (Optional)" name="image" value={formData.image} onChange={handleInputChange} placeholder="Enter Unsplash or web image URL" error={formErrors.image} />
          </div>
        </form>
      </Modal>

      <Modal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Product"
        size="md"
        footer={
          <>
            <Button text="Cancel" variant="outline" size="sm" onClick={() => setShowEditModal(false)} />
            <Button text="Save Changes" variant="primary" size="sm" onClick={handleEditSubmit} />
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <Input label="Product Name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" error={formErrors.name} required />
          <div className="row mt-3">
            <div className="col-md-6">
              <Input label="Price (₹)" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Enter price" error={formErrors.price} required />
            </div>
            <div className="col-md-6">
              <Input label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleInputChange} placeholder="Enter stock" error={formErrors.stock} required />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <div className="custom-input-wrapper">
                <label className="custom-input-label">Category *</label>
                <div className="custom-input-container">
                  <select name="category" value={formData.category} onChange={handleInputChange} className="custom-input border-0 bg-transparent w-100" style={{ outline: 'none' }}>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="custom-input-wrapper">
                <label className="custom-input-label">Size *</label>
                <div className="custom-input-container">
                  <select name="size" value={formData.size} onChange={handleInputChange} className="custom-input border-0 bg-transparent w-100" style={{ outline: 'none' }}>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Input label="Image URL (Optional)" name="image" value={formData.image} onChange={handleInputChange} placeholder="Enter Unsplash or web image URL" error={formErrors.image} />
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProductTable;
