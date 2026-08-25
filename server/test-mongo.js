const mongoose = require('mongoose');
const uri = 'mongodb://toolt809_db_user:UxdS72otXShP41Zr@ac-1htjxoj-shard-00-00.qs41wlh.mongodb.net:27017,ac-1htjxoj-shard-00-01.qs41wlh.mongodb.net:27017,ac-1htjxoj-shard-00-02.qs41wlh.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-bueoci-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
