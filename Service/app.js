const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
require('dotenv').config();

const port = 5000;

// Cors yapılandırması
const corsOptions = {
  origin: '*', // İzin verilen alanın URL'sini buraya ekleyin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(logger("dev"))

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});

const mongoURI = process.env.MONGO_URI;
const conn = async () => {
  try {
    await mongoose.connect(mongoURI);
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