const { cleanEnv, str, port, url } = require('envalid');

const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
  PORT: port({ default: 5000 }),
  MONGODB_URI: url({ default: 'mongodb://localhost:27017/ecommerce' }),
  JWT_SECRET: str(),
  ENCRYPTION_KEY: str(),
  CLIENT_URL: url({ default: 'http://localhost:5173' })
});

module.exports = env;
