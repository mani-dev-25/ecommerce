const fetch = require('node-fetch');

async function loginAndGetToken(email, password) {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  return data.token;
}

async function placeOrder(token, productId) {
  const orderData = {
    items: [{ productId: productId, quantity: 1 }],
    shippingAddress: "Test Address",
    contactPhone: "1234567890"
  };
  const res = await fetch('http://localhost:5000/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return await res.json();
}

async function run() {
  // We assume admin user is admin@vynex.com / Admin@123 or similar?
  // I need to create two users first or just register them.
  
  console.log("Registering user 1...");
  await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "User1", email: "user1@test.com", password: "password123", phone: "1234567890", address: "abc", otp: "123456" }) // bypass otp? we can't bypass otp easily.
  });
}
run();
