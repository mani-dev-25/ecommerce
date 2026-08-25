const express = require('express');
const router = express.Router();
const { Product } = require('../models/models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { validateProductCreate, validateProductUpdate } = require('../middleware/validate');

// @route   GET /api/products
// @desc    Get all products (with optional filtering and pagination)
router.get('/', asyncHandler(async (req, res) => {
  const { category, search, size, minPrice, maxPrice } = req.query;
  const filter = {};

  if (category) {
    // allow comma separated categories
    const categories = category.split(',');
    filter.category = { $in: categories };
  }

  if (size) {
    filter.size = size;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  const page = parseInt(req.query.page, 10) || 1;
  const requestedLimit = parseInt(req.query.limit, 10) || 12;
  const limit = Math.min(requestedLimit, 50); // Cap the limit at 50
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const products = await Product.find(filter)
    .sort({ createdAt: -1, id: 1 }) // Use our new index!
    .skip(skip)
    .limit(limit)
    .lean(); // Optimize query

  res.json({
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  });
}));

// @route   GET /api/products/:id
// @desc    Get single product by numeric id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ id: parseInt(req.params.id) }).lean();
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(product);
}));

// @route   POST /api/products
// @desc    Create a product (Admin only)
router.post('/', [authMiddleware, adminMiddleware, validateProductCreate], asyncHandler(async (req, res) => {
  const { title, category, size, price, oldPrice, discount, rating, image, stock } = req.body;

  // Determine the next numeric ID
  const lastProduct = await Product.findOne().sort({ id: -1 });
  const nextId = lastProduct ? lastProduct.id + 1 : 1;

  const product = new Product({
    id: nextId,
    title,
    category,
    size: size || 'M',
    price,
    oldPrice,
    discount: discount || 0,
    rating: rating || 4.5,
    image,
    stock: stock !== undefined ? stock : 20
  });

  await product.save();
  res.status(201).json(product);
}));

// @route   PUT /api/products/:id
// @desc    Update a product by numeric ID (Admin only)
router.put('/:id', [authMiddleware, adminMiddleware, validateProductUpdate], asyncHandler(async (req, res) => {
  const { title, category, size, price, oldPrice, discount, rating, image, stock } = req.body;

  let product = await Product.findOne({ id: parseInt(req.params.id) });
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  // Update fields
  if (title !== undefined) product.title = title;
  if (category !== undefined) product.category = category;
  if (size !== undefined) product.size = size;
  if (price !== undefined) product.price = price;
  if (oldPrice !== undefined) product.oldPrice = oldPrice;
  if (discount !== undefined) product.discount = discount;
  if (rating !== undefined) product.rating = rating;
  if (image !== undefined) product.image = image;
  if (stock !== undefined) product.stock = stock;

  await product.save();
  res.json(product);
}));

// @route   DELETE /api/products/:id
// @desc    Delete a product by numeric ID (Admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ id: parseInt(req.params.id) });
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ message: 'Product deleted successfully.' });
}));

module.exports = router;
