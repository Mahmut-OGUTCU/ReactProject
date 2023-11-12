// AuthController.js
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatString, isValidEmail } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Register Process
 */
router.post('/register', async (req, res) => {
    try {
        // string ifadeyi formatla
        const firstname = formatString(req.body.firstname);
        const lastname = formatString(req.body.lastname)
        const email = req.body.email
        const password = req.body.password.trim()

        if (!firstname || firstname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı adı boş olamaz.', data: null });
        if (!lastname || lastname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı soyadı boş olamaz.', data: null });
        if (!email || email === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı e-posta boş olamaz.', data: null });
        if (!password || password === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı şifresi boş olamaz.', data: null });

        // E-posta adresinin geçerliliğini kontrol et
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: 'Geçersiz bir e-posta adresi.', data: null });

        // title alanını unique olarak kontrol et
        if (await User.findOne({ email: email, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu e-posta zaten kullanılmaktadır. Lütfen başka bir e-posta deneyin.', data: null });

        // password hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // kaydı düzenle
        const value = new User(
            {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashedPassword,
                createdAt: new Date(),
                createdId: null,
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kullanıcı kayıt oldu.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Login Process
 */
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password.trim()

        if (!email || email === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı e-posta boş olamaz.', data: null });
        if (!password || password === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı şifresi boş olamaz.', data: null });

        // E-posta adresinin geçerliliğini kontrol et
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: 'Geçersiz bir e-posta adresi.', data: null });

        // kullanıcıyı getir
        const user = await User.findOne({ email: email, isActive: true })
        if (!user)
            return res.status(400).send({ status: false, message: 'e-posta veya şfire hatalı.', data: null });

        // Şifre doğrulaması yap
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ status: false, message: 'e-posta veya şfire hatalı.', data: null });
        }

        // Kullanıcı başarılı bir şekilde giriş yaptı, JWT oluştur
        const token = jwt.sign({ id: user._id, mail: user.email, isAdmin: user.isAdmin }, 'gizliAnahtar', { expiresIn: '1h' });

        user.token = token;
        user.lastlogin = new Date();

        // kaydı güncelle
        await user.save();

        res.status(200).send({ status: true, message: 'Giriş başarılı.', data: token });

    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Logout Process
 */
router.post('/logout', checkAuth, async (req, res) => {
    try {
        // kullanıcıyı getir
        const user = await User.findOne({ _id: req.user.id, isActive: true })
        if (!user)
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        user.token = '';

        // kaydı güncelle
        await value.save();

        res.status(200).send({ status: true, message: 'Giriş başarılı.', data: token });

    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

module.exports = router;