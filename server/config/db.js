const mongoose = require('mongoose');
const { Product } = require('../models/models');

const seedProducts = [
  {
    id: 1,
    title: "Men's Running Shoes",
    category: "Men",
    size: "M",
    price: 2999,
    oldPrice: 3999,
    discount: 25,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stock: 35
  },
  {
    id: 2,
    title: "Men's Hoodie",
    category: "Men",
    size: "L",
    price: 1499,
    oldPrice: 1999,
    discount: 20,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
    stock: 35
  },
  {
    id: 3,
    title: "Men's Jacket",
    category: "Men",
    size: "M",
    price: 2499,
    oldPrice: 3499,
    discount: 30,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    stock: 12
  },
  {
    id: 4,
    title: "Men's T-Shirt",
    category: "Men",
    size: "S",
    price: 899,
    oldPrice: 1299,
    discount: 15,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    stock: 0
  },
  {
    id: 5,
    title: "Women's Dress",
    category: "Women",
    size: "S",
    price: 1899,
    oldPrice: 2499,
    discount: 20,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    stock: 35
  },
  {
    id: 6,
    title: "Women's Handbag",
    category: "Women",
    size: "M",
    price: 2299,
    oldPrice: 2999,
    discount: 25,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    stock: 35
  },
  {
    id: 7,
    title: "Women's Heels",
    category: "Women",
    size: "L",
    price: 1999,
    oldPrice: 2799,
    discount: 28,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
    stock: 35
  },
  {
    id: 8,
    title: "Women's Hoodie",
    category: "Women",
    size: "M",
    price: 1599,
    oldPrice: 2099,
    discount: 18,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500",
    stock: 0
  },
  {
    id: 9,
    title: "Men's Jeans",
    category: "Men",
    size: "L",
    price: 1799,
    oldPrice: 2399,
    discount: 25,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    stock: 35
  },
  {
    id: 10,
    title: "Men's Casual Shirt",
    category: "Men",
    size: "S",
    price: 1299,
    oldPrice: 1699,
    discount: 20,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
    stock: 35
  },
  {
    id: 11,
    title: "Women's Top",
    category: "Women",
    size: "S",
    price: 999,
    oldPrice: 1399,
    discount: 15,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500",
    stock: 35
  },
  {
    id: 12,
    title: "Women's Sneakers",
    category: "Women",
    size: "M",
    price: 2499,
    oldPrice: 3299,
    discount: 24,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
    stock: 0
  },
  {
    id: 13,
    title: "PlayStation 5 Console",
    category: "Electronics",
    size: "Standard",
    price: 49999,
    oldPrice: 54999,
    discount: 9,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
    stock: 12
  },
  {
    id: 14,
    title: "Xbox Series X",
    category: "Electronics",
    size: "Standard",
    price: 45999,
    oldPrice: 50999,
    discount: 10,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500",
    stock: 0
  },
  {
    id: 15,
    title: "Gaming Headset",
    category: "Electronics",
    size: "One Size",
    price: 1999,
    oldPrice: 2999,
    discount: 33,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500",
    stock: 35
  },
  {
    id: 16,
    title: "Cricket Bat (English Willow)",
    category: "Sports",
    size: "Short Handle",
    price: 3499,
    oldPrice: 4999,
    discount: 30,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500", // Fallback from data URI for stability
    stock: 0
  },
  {
    id: 17,
    title: "Cricket Ball (Leather)",
    category: "Sports",
    size: "Standard",
    price: 799,
    oldPrice: 999,
    discount: 20,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=500",
    stock: 35
  },
  {
    id: 18,
    title: "Football (FIFA Quality)",
    category: "Sports",
    size: "5",
    price: 1299,
    oldPrice: 1799,
    discount: 28,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1614631446501-abcf76949eca?w=500",
    stock: 12
  },
  {
    id: 19,
    title: "Basketball",
    category: "Sports",
    size: "7",
    price: 999,
    oldPrice: 1499,
    discount: 33,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500",
    stock: 35
  },
  {
    id: 20,
    title: "Wireless Mouse (Gaming)",
    category: "Electronics",
    size: "Standard",
    price: 1499,
    oldPrice: 1999,
    discount: 25,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500",
    stock: 0
  }
];

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Seed standard catalog products if the collection is empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Product catalog empty. Seeding default products...');
      await Product.insertMany(seedProducts);
      console.log('Default products seeded successfully!');
    }
  } catch (err) {
    console.error(`MongoDB connection failure: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
