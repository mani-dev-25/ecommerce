require('dotenv').config();
const env = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);

// Initialize Express App
const app = express();

// Connect to MongoDB & Seed Database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middlewares
app.use(helmet());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// HTTPS Redirect in Production
if (env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

const corsOptions = {
  origin: env.NODE_ENV === 'production'
    ? env.CLIENT_URL
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(apiLimiter);

// Base Route for Checking API Health
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'healthy',
    message: 'Vynex Premium E-Commerce API is running smoothly.',
    database: dbStatusMap[dbState] || 'unknown'
  });
});

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/payment', require('./routes/payment'));

// Global Error Handler
app.use(errorHandler);

// Bind Port & Listen
if (env.NODE_ENV !== 'test') {
  const PORT = env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  VYNEX PREMIUM SERVER RUNNING ON PORT ${PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
