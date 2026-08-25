const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { Order, Product } = require('../models/models');
const { authMiddleware } = require('../middleware/auth');
const { encrypt } = require('../utils/crypto');
const asyncHandler = require('../middleware/asyncHandler');

// Helper to initialize Razorpay instance dynamically
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('your_key_id')) {
    throw new Error('Razorpay API keys are not properly configured in server environment.');
  }

  return new Razorpay({
    key_id,
    key_secret
  });
};

// @route   GET /api/payment/key
// @desc    Get Razorpay Public Key ID
router.get('/key', (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID || '' });
});

// @route   POST /api/payment/create-order
// @desc    Create a new Razorpay Order
router.post('/create-order', authMiddleware, asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' });
  }

  // 1. Calculate total native amount on backend to prevent price tampering
  let subtotalAmount = 0;
  for (const item of items) {
    const dbProduct = await Product.findOne({ id: item.productId });
    if (!dbProduct) {
      return res.status(404).json({ error: `Product not found: ${item.productId}` });
    }
    if (dbProduct.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for product: ${dbProduct.title}` });
    }
    subtotalAmount += dbProduct.price * item.quantity;
  }

  // Calculate discount & delivery charges matching frontend logic
  const discount = subtotalAmount > 10000 ? Math.round(subtotalAmount * 0.1) : 0;
  const baseDelivery = subtotalAmount > 5000 || subtotalAmount === 0 ? 0 : 99;
  const finalTotalAmount = Math.max(1, subtotalAmount - discount + baseDelivery);

  // Amount in Paise for Razorpay (1 INR = 100 Paise)
  const amountInPaise = Math.round(finalTotalAmount * 100);

  const razorpay = getRazorpayInstance();

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}_${req.user.id.toString().slice(-6)}`,
    notes: {
      userId: req.user.id.toString()
    }
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID
  });
}));

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment signature and place order
router.post('/verify', authMiddleware, asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shippingAddress,
    contactPhone
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'Missing Razorpay payment verification parameters.' });
  }

  // 1. Verify HMAC SHA256 signature
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  const generatedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ error: 'Invalid payment signature. Transaction verification failed.' });
  }

  // 2. Validate products & calculate backend prices
  let subtotalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const dbProduct = await Product.findOne({ id: item.productId });
    if (!dbProduct) {
      return res.status(404).json({ error: `Product not found: ${item.productId}` });
    }
    if (dbProduct.stock < item.quantity) {
      return res.status(400).json({ error: `Insufficient stock for product ${dbProduct.title}.` });
    }

    const subtotal = dbProduct.price * item.quantity;
    subtotalAmount += subtotal;

    processedItems.push({
      productId: dbProduct.id,
      title: dbProduct.title,
      price: dbProduct.price,
      quantity: item.quantity,
      image: dbProduct.image
    });
  }

  const discount = subtotalAmount > 10000 ? Math.round(subtotalAmount * 0.1) : 0;
  const baseDelivery = subtotalAmount > 5000 || subtotalAmount === 0 ? 0 : 99;
  const finalTotalAmount = Math.max(1, subtotalAmount - discount + baseDelivery);

  // 3. Decrement product stocks atomically
  const decrementedProducts = [];
  let raceConditionCaught = false;
  let failedProductName = '';

  for (const item of processedItems) {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
    if (!updatedProduct) {
      raceConditionCaught = true;
      failedProductName = item.title;
      break;
    }
    decrementedProducts.push({ productId: item.productId, quantity: item.quantity });
  }

  if (raceConditionCaught) {
    for (const dec of decrementedProducts) {
      await Product.findOneAndUpdate(
        { id: dec.productId },
        { $inc: { stock: dec.quantity } }
      );
    }
    return res.status(409).json({ error: `Stock changed during checkout for product ${failedProductName}. Payment captured, please contact support with payment ID: ${razorpay_payment_id}.` });
  }

  // 4. Encrypt sensitive address & phone fields
  const encryptedAddress = encrypt(shippingAddress);
  const encryptedPhone = encrypt(contactPhone);

  // 5. Save completed order in DB
  const order = new Order({
    userId: req.user.id,
    items: processedItems,
    totalAmount: finalTotalAmount,
    shippingAddress: encryptedAddress,
    contactPhone: encryptedPhone,
    paymentStatus: 'paid',
    paymentMethod: 'razorpay',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    orderStatus: 'pending'
  });

  await order.save();

  res.status(201).json({
    _id: order._id,
    userId: order.userId,
    items: order.items,
    totalAmount: order.totalAmount,
    shippingAddress,
    contactPhone,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    razorpayPaymentId: order.razorpayPaymentId,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt
  });
}));

module.exports = router;
