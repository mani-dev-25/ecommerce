const { check, validationResult } = require('express-validator');

// Middleware to check for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return res.status(400).json({ error: 'Validation failed', details });
  }
  next();
};

// ================= AUTH VALIDATION =================
const validateRegister = [
  check('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  check('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  check('password').notEmpty().withMessage('Password is required').isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters long'),
  check('phone').optional({ checkFalsy: true }).isNumeric().withMessage('Phone must be numeric').isLength({ min: 10, max: 10 }).withMessage('Phone must be exactly 10 digits'),
  check('address').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('Address is too long'),
  check('otp').notEmpty().withMessage('Verification code is required').isNumeric().isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 digits'),
  validateRequest
];

const validateLogin = [
  check('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  check('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

const validateSendOtp = [
  check('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  validateRequest
];

// ================= PRODUCT VALIDATION =================
const validateProductCreate = [
  check('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  check('category').trim().notEmpty().withMessage('Category is required'),
  check('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  check('oldPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  check('discount').optional().isFloat({ min: 0, max: 100 }),
  check('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  check('image').trim().notEmpty().withMessage('Image URL is required'),
  check('size').optional().trim(),
  validateRequest
];

const validateProductUpdate = [
  check('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  check('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  check('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  check('oldPrice').optional({ checkFalsy: true }).isFloat({ min: 0 }),
  check('discount').optional().isFloat({ min: 0, max: 100 }),
  check('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  check('image').optional().trim().notEmpty().withMessage('Image URL cannot be empty'),
  check('size').optional().trim(),
  validateRequest
];

// ================= ORDER VALIDATION =================
const validateOrderPlace = [
  check('items').isArray({ min: 1 }).withMessage('Items array is required and cannot be empty'),
  check('items.*.productId').notEmpty().withMessage('Product ID is required'),
  check('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  // Note: we don't validate price sent from frontend because we will calculate it on the server
  check('shippingAddress').trim().notEmpty().withMessage('Shipping address is required').isLength({ max: 500 }),
  check('contactPhone').trim().notEmpty().withMessage('Contact phone is required'),
  validateRequest
];

const validateOrderStatusUpdate = [
  check('orderStatus').optional().isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid order status'),
  check('paymentStatus').optional().isIn(['pending', 'paid', 'failed']).withMessage('Invalid payment status'),
  validateRequest
];

module.exports = {
  validateRegister,
  validateLogin,
  validateSendOtp,
  validateProductCreate,
  validateProductUpdate,
  validateOrderPlace,
  validateOrderStatusUpdate
};
