const request = require('supertest');
const app = require('../index');

// Set dummy JWT_SECRET and ENCRYPTION_KEY for tests
process.env.JWT_SECRET = 'test_secret';
process.env.ENCRYPTION_KEY = '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e';

describe('Auth Endpoints', () => {
  let otp;

  it('should generate an OTP for registration', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({ email: 'test@vynex.com' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Verification code sent successfully.');
    // Extract OTP directly from the DB for testing purposes
    const { Otp } = require('../models/models');
    const otpDoc = await Otp.findOne({ email: 'test@vynex.com' });
    otp = otpDoc.otp;
  });

  it('should register a user with a valid OTP', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@vynex.com',
        password: 'Password123!',
        otp
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('email', 'test@vynex.com');
    // Check if refresh token is in cookies
    const cookies = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/vynex_refresh=/);
  });

  it('should authenticate user and return tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@vynex.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    const cookies = res.headers['set-cookie'];
    expect(cookies[0]).toMatch(/vynex_refresh=/);
  });
});
