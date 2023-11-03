const express = require('express');
const cors = require('cors');
const app = express();
const port = 5432;

const userController = require('./userController');
const accountController = require('./accountController');

app.use(cors());
app.use(express.json());

app.use('/api/users', userController);
app.use('/api/account', accountController);

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});