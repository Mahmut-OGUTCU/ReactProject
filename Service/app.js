const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose")

const config = require('./config');

const port = 5000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});

const conn = async () => {
  try {
    await mongoose.connect(config.dbConfig.url);
    console.log("MongoDB'ye başarıyla bağlandı!");
  } catch (err) {
    console.log(err);
    throw err;
  }
}

conn()

const CategoryController = require('./controllers/CategoryController');
app.use('/api/category', CategoryController);

const ProductController = require('./controllers/ProductController');
app.use('/api/product', ProductController);

const BillController = require('./controllers/BillController');
app.use('/api/bill', BillController);

const UserController = require('./controllers/UserController');
app.use('/api/user', UserController);

const AuthController = require('./controllers/AuthController');
app.use('/api/auth', AuthController);