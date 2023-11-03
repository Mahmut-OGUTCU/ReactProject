// AccountController.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { isValidEmail } = require('./utils');

const pool = new Pool(config.dbConfig);
const router = express.Router();

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        const { name, surname, mail, password } = req.body;

        // E-posta adresinin geçerliliğini kontrol et
        if (!isValidEmail(mail)) {
            return res.status(400).send('Geçersiz e-posta adresi.');
        }

        // E-posta adresinin benzersizliğini kontrol et
        const checkUniqueMailQuery = 'SELECT COUNT(*) FROM users WHERE mail = $1';
        const uniqueMailCheck = await pool.query(checkUniqueMailQuery, [mail]);

        if (uniqueMailCheck.rows[0].count > 0) {
            return res.status(400).send('Bu e-posta adresi zaten kullanılıyor.');
        }

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

// Kullanıcı girişi (login)
router.post('/login', async (req, res) => {
    try {
        const { mail, password } = req.body;

        // Kullanıcıyı e-posta adresine göre sorgula
        const getUserQuery = 'SELECT * FROM users WHERE mail = $1';
        const userResult = await pool.query(getUserQuery, [mail]);

        if (userResult.rows.length === 0) {
            return res.status(401).send('Kullanıcı bulunamadı.');
        }

        const user = userResult.rows[0];

        // Şifre doğrulaması yap
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).send('Şifre yanlış.');
        }

        // Kullanıcı başarılı bir şekilde giriş yaptı, JWT oluştur
        const token = jwt.sign({ id: user.id, mail: user.mail }, 'gizliAnahtar', { expiresIn: '1h' });

        // JWT'yi kullanıcıya gönder
        res.status(200).json({ message: 'Giriş başarılı', user: user, token: token });
    } catch (error) {
        console.error('Kullanıcı giriş hatası:', error);
        res.status(500).send('Kullanıcı girişi sırasında bir hata oluştu.');
    }
});

module.exports = router;
