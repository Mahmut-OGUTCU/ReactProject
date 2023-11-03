// UserController.js
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const config = require('./config');
const checkAuth = require('./middleware');
const { isValidEmail } = require('./utils');

const pool = new Pool(config.dbConfig);
const router = express.Router();

// Tüm kullanıcıları listele
router.get('/get-users', checkAuth, async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Kullanıcı listeleme hatası:', error);
        res.status(500).send('Kullanıcıları listelerken bir hata oluştu.');
    }
});

// Kullanıcı oluştur
router.post('/create-user', checkAuth, async (req, res) => {
    try {
        const { name, surname, mail, password } = req.body;

        // Kullanıcı kimliğini token'dan al
        const userId = req.user.userId;

        // Kullanıcı kimliğini kullanarak kullanıcıyı bul ve işlemi gerçekleştir
        // Örnek: Kullanıcıyı veritabanından çekme
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).send('Kullanıcı bulunamadı.');
        }

        // Kullanıcıyı eklemek ve işlemi gerçekleştirmek
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, surname, mail, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [name, surname, mail, hashedPassword];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Kullanıcı oluşturma hatası:', error);
        res.status(500).send('Kullanıcı oluşturulurken bir hata oluştu.');
    }
});

// Diğer işlemleri de benzer şekilde kullanıcı kimliği ile gerçekleştirebilirsiniz.


// Kullanıcı güncelle
router.put('/update-user', checkAuth, async (req, res) => {
    const { id, name, surname, mail } = req.body;

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

    try {
        const query = 'UPDATE users SET name=$1, surname=$2, mail=$3 WHERE id=$4';
        const values = [name, surname, mail, id];

        await pool.query(query, values);
        res.status(204).send(); // Başarılı güncelleme işlemi, içerik döndürmez.
    } catch (error) {
        console.error('Kullanıcı güncelleme hatası:', error);
        res.status(500).send('Kullanıcı güncellenirken bir hata oluştu.');
    }
});

// Kullanıcı şifre güncelle
router.put('/update-user-password', checkAuth, async (req, res) => {
    const { id, password } = req.body;

    try {
        const query = 'UPDATE users SET password=$1 WHERE id=$2';
        const values = [password, id];

        await pool.query(query, values);
        res.status(204).send(); // Başarılı güncelleme işlemi, içerik döndürmez.
    } catch (error) {
        console.error('Kullanıcı şifre güncelleme hatası:', error);
        res.status(500).send('Kullanıcı şifresi güncellenirken bir hata oluştu.');
    }
});

// Kullanıcı sil
router.delete('/delete-user', checkAuth, async (req, res) => {
    const { id } = req.body;

    try {
        const query = 'DELETE FROM users WHERE id = $1';
        const values = [id];

        await pool.query(query, values);
        res.status(204).send(); // Başarılı silme işlemi, içerik döndürmez.
    } catch (error) {
        console.error('Kullanıcı silme hatası:', error);
        res.status(500).send('Kullanıcı silinirken bir hata oluştu.');
    }
});

async function getUserById(userId) {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null; // Kullanıcı bulunamadıysa null döndürün
        }
    } catch (error) {
        console.error('Kullanıcı sorgulama hatası:', error);
        throw error; // İşlem sırasında bir hata oluşursa hatayı yukarı yönlendirin
    }
}

module.exports = router;
