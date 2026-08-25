const express = require('express');
const router = express.Router();
const { Product } = require('../models/models');
const { apiLimiter } = require('../middleware/rateLimiter');

// @route   GET /api/categories
// @desc    Get all categories along with their respective product counts
router.get('/', apiLimiter, async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    res.json(categories);
  } catch (err) {
    console.error('Fetch Categories API Error:', err.message);
    res.status(500).json({ error: 'Server category aggregation error.' });
  }
});

module.exports = router;
