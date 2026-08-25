const request = require('supertest');
const app = require('../index');

process.env.JWT_SECRET = 'test_secret';
process.env.ENCRYPTION_KEY = '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e';

describe('Orders Endpoints & Stock Race Condition', () => {
  let token;
  let productId;

  beforeAll(async () => {
    // Register a user
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Order Test User',
      email: 'ordertest@vynex.com',
      password: 'Password123!',
      otp: '123456' // mock OTP validation bypass or seed DB
    });
    // For simplicity in integration test, we might mock DB or just test the logic directly
  });

  it('should prevent race conditions on stock decrement', async () => {
    // Creating a mock product in DB
    const { Product } = require('../models/models');
    const product = new Product({
      id: 999,
      title: 'Race Condition Item',
      category: 'Test',
      price: 100,
      image: 'test.png',
      stock: 5
    });
    await product.save();

    productId = product.id;

    // Simulate 2 concurrent checkouts requesting 3 items each (total 6 > stock 5)
    // One should succeed, one should fail.
    const checkoutReq = {
      items: [{ productId: 999, quantity: 3 }],
      shippingAddress: '123 Test St',
      contactPhone: '1234567890'
    };

    // Note: since auth is required, we generate a fake token
    const jwt = require('jsonwebtoken');
    token = jwt.sign({ id: '507f1f77bcf86cd799439011', role: 'user' }, process.env.JWT_SECRET);

    const req1 = request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(checkoutReq);
    const req2 = request(app).post('/api/orders').set('Authorization', `Bearer ${token}`).send(checkoutReq);

    const [res1, res2] = await Promise.all([req1, req2]);

    const statuses = [res1.statusCode, res2.statusCode];
    expect(statuses).toContain(201);
    expect(statuses).toContain(409); // One should fail with race condition (409) or insufficient stock (400)
    
    const dbProduct = await Product.findOne({ id: 999 });
    expect(dbProduct.stock).toBe(2); // Only 3 were taken
  });
});
