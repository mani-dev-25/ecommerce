const express = require('express');
const router = express.Router();
const { Order, Product, User } = require('../models/models');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/crypto');
const asyncHandler = require('../middleware/asyncHandler');
const { validateOrderPlace, validateOrderStatusUpdate } = require('../middleware/validate');

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', authMiddleware, validateOrderPlace, asyncHandler(async (req, res) => {
  const { items, shippingAddress, contactPhone, paymentMethod = 'cod' } = req.body;

  // 1. Verify stocks, calculate total amount natively on backend
  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const dbProduct = await Product.findOne({ id: item.productId });
    if (!dbProduct) {
      return res.status(404).json({ error: `Product not found: ${item.productId}` });
    }
    if (dbProduct.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for product id ${item.productId}. Available: ${dbProduct.stock}` });
    }
    
    // Use server-trusted price and title
    const subtotal = dbProduct.price * item.quantity;
    totalAmount += subtotal;

    processedItems.push({
      productId: dbProduct.id,
      title: dbProduct.title,
      price: dbProduct.price,
      quantity: item.quantity,
      image: dbProduct.image
    });
  }

  // 2. Decrement product stocks atomically to prevent race conditions
  const decrementedProducts = [];
  let raceConditionCaught = false;
  let failedProductName = "";

  for (const item of processedItems) {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      // Race condition caught
      raceConditionCaught = true;
      failedProductName = item.title;
      break;
    }
    decrementedProducts.push({ productId: item.productId, quantity: item.quantity });
  }

  if (raceConditionCaught) {
    // Rollback the previously decremented products
    for (const dec of decrementedProducts) {
      await Product.findOneAndUpdate(
        { id: dec.productId },
        { $inc: { stock: dec.quantity } }
      );
    }
    return res.status(409).json({ error: `Stock changed during checkout for product ${failedProductName}. Please review your cart and try again.` });
  }

  // 3. Encrypt shipping address and contact phone
  const encryptedAddress = encrypt(shippingAddress);
  const encryptedPhone = encrypt(contactPhone);

  const order = new Order({
    userId: req.user.id,
    items: processedItems,
    totalAmount,
    shippingAddress: encryptedAddress,
    contactPhone: encryptedPhone,
    paymentStatus: 'pending',
    paymentMethod: paymentMethod || 'cod',
    orderStatus: 'pending'
  });

  await order.save();
  
  // Return order, but decrypt fields for the immediate response
  res.status(201).json({
    _id: order._id,
    userId: order.userId,
    items: order.items,
    totalAmount: order.totalAmount,
    shippingAddress,
    contactPhone,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt
  });
}));

// @route   GET /api/orders
// @desc    Get logged in user's order history
router.get('/', authMiddleware, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const requestedLimit = parseInt(req.query.limit, 10) || 12;
  const limit = Math.min(requestedLimit, 50);
  const skip = (page - 1) * limit;

  const filter = { userId: req.user.id };
  const total = await Order.countDocuments(filter);
  const totalPages = Math.ceil(total / limit);

  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  // Decrypt fields in the array
  const decryptedOrders = orders.map(order => {
    const oObj = order.toObject();
    oObj.shippingAddress = decrypt(oObj.shippingAddress);
    oObj.contactPhone = decrypt(oObj.contactPhone);
    return oObj;
  });

  res.json({
    orders: decryptedOrders,
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

// @route   GET /api/orders/admin
// @desc    Get all orders (Admin only)
router.get('/admin', [authMiddleware, adminMiddleware], asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const requestedLimit = parseInt(req.query.limit, 10) || 12;
  const limit = Math.min(requestedLimit, 50);
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments();
  const totalPages = Math.ceil(total / limit);

  const orders = await Order.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const decryptedOrders = orders.map(order => {
    const oObj = order.toObject();
    oObj.shippingAddress = decrypt(oObj.shippingAddress);
    oObj.contactPhone = decrypt(oObj.contactPhone);
    return oObj;
  });

  res.json({
    orders: decryptedOrders,
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

// @route   PUT /api/orders/admin/:id/status
// @desc    Update order status (Admin only)
router.put('/admin/:id/status', [authMiddleware, adminMiddleware, validateOrderStatusUpdate], asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (orderStatus !== undefined) order.orderStatus = orderStatus;
  if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

  await order.save();
  
  const decryptedOrder = order.toObject();
  decryptedOrder.shippingAddress = decrypt(decryptedOrder.shippingAddress);
  decryptedOrder.contactPhone = decrypt(decryptedOrder.contactPhone);

  res.json(decryptedOrder);
}));
// @route   GET /api/orders/admin/stats
// @desc    Get dashboard stats (Admin only)
router.get('/admin/stats', [authMiddleware, adminMiddleware], asyncHandler(async (req, res) => {
  const [orderStats] = await Order.aggregate([
    {
      $project: {
        totalAmount: 1,
        totalQuantity: { $sum: "$items.quantity" }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
        ordersCount: { $sum: 1 },
        totalProducts: { $sum: "$totalQuantity" }
      }
    }
  ]);

  const usersCount = await User.countDocuments();

  res.json({
    totalSales: orderStats ? orderStats.totalProducts : 0,
    revenue: orderStats ? orderStats.totalRevenue : 0,
    ordersCount: orderStats ? orderStats.ordersCount : 0,
    usersCount
  });
}));

module.exports = router;
