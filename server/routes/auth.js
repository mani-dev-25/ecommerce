const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Otp } = require('../models/models');
const { encrypt, decrypt } = require('../utils/crypto');
const { authMiddleware } = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/mailer');
const asyncHandler = require('../middleware/asyncHandler');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const { validateRegister, validateLogin, validateSendOtp } = require('../middleware/validate');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
  process.exit(1);
}

// Helper to generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Helper to set refresh token cookie
const setRefreshTokenCookie = (res, token) => {
  res.cookie('vynex_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// @route   POST /api/auth/send-otp
// @desc    Generate and send OTP for email verification
router.post('/send-otp', otpLimiter, validateSendOtp, asyncHandler(async (req, res) => {
  const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email address.' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database, replacing any old OTP for this email
    await Otp.findOneAndDelete({ email });
    const otpDoc = new Otp({ email, otp });
    await otpDoc.save();

  // Send the OTP email
  await sendOtpEmail(email, otp);

  res.json({ message: 'Verification code sent successfully.' });
}));

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', authLimiter, validateRegister, asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, otp } = req.body;
    // Verify OTP
    if (!otp) {
      return res.status(400).json({ error: 'Verification code is required.' });
    }

    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    // Delete the OTP since it is now verified and used
    await Otp.deleteOne({ _id: otpRecord._id });

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ error: 'User already exists with this email address.' });
  }

  // Set role - normal registration always results in a 'user' role
  const assignedRole = 'user';

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Encrypt sensitive fields before saving to DB
    const encryptedPhone = phone ? encrypt(phone) : '';
    const encryptedAddress = address ? encrypt(address) : '';

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      phone: encryptedPhone,
      address: encryptedAddress
    });

    await user.save();

    // Create Tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: phone || '',
        address: address || ''
      }
    });
}));

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', authLimiter, validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Decrypt sensitive fields before sending back to user
    const decryptedPhone = user.phone ? decrypt(user.phone) : '';
    const decryptedAddress = user.address ? decrypt(user.address) : '';

    // Create Tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: decryptedPhone,
        address: decryptedAddress
      }
    });
}));

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', authMiddleware, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Decrypt sensitive fields
    const decryptedPhone = user.phone ? decrypt(user.phone) : '';
    const decryptedAddress = user.address ? decrypt(user.address) : '';

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: decryptedPhone,
    address: decryptedAddress,
    createdAt: user.createdAt
  });
}));

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
router.post('/refresh-token', asyncHandler(async (req, res) => {
  const token = req.cookies.vynex_refresh;
  if (!token) {
    return res.status(401).json({ error: 'Refresh token not found.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ error: 'Invalid or revoked refresh token.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshTokenCookie(res, refreshToken);

    res.json({ token: accessToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
}));

// @route   POST /api/auth/logout
// @desc    Logout user and revoke tokens
router.post('/logout', authMiddleware, asyncHandler(async (req, res) => {
  // Revoke all refresh tokens by incrementing tokenVersion
  await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });
  
  res.clearCookie('vynex_refresh');
  res.json({ message: 'Logged out successfully.' });
}));

const { adminMiddleware } = require('../middleware/auth');

// @route   GET /api/auth/admin/users
// @desc    Get all users (paginated, Admin only)
router.get('/admin/users', [authMiddleware, adminMiddleware], asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const requestedLimit = parseInt(req.query.limit, 10) || 12;
  const limit = Math.min(requestedLimit, 50);
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const totalPages = Math.ceil(total / limit);

  const users = await User.find()
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    users,
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

// @route   PUT /api/auth/admin/users/:id/role
// @desc    Update user role (Admin only)
router.put('/admin/users/:id/role', [authMiddleware, adminMiddleware], asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  // Prevent admin from demoting themselves
  if (req.params.id === req.user.id && role !== 'admin') {
    return res.status(403).json({ error: 'Cannot demote your own account.' });
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json(user);
}));

module.exports = router;
