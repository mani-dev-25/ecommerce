const request = require('supertest');
const app = require('../index');

describe('Products Endpoints', () => {
  it('should get empty products list initially', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.products).toBeInstanceOf(Array);
    expect(res.body.products.length).toBe(0);
  });
});
