const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// PostgreSQL veritabanı bağlantısı
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '12345678Mm!',
  port: 5432,
});

app.use(express.json());

// Kullanıcı kaydı
app.post('/register', async (req, res) => {
  try {
    const { name, surname, mail, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, surname, mail, password) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, surname, mail, hashedPassword];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Kullanıcı kaydı hatası:', error);
    res.status(500).send('Kullanıcı kaydı sırasında bir hata oluştu.');
  }
});

// Kullanıcıları listele
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * ßFROM users';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Kullanıcı listeleme hatası:', error);
    res.status(500).send('Kullanıcıları listeleme sırasında bir hata oluştu.');
  }
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});