// UserController.js
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { formatString } = require('../utils');
const checkAuth = require('../middleware');

/**
 * Get All User Values Process
 */
router.post('/user-get', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // id tipi kontrol et
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(400).send({ status: false, message: 'Geçerli bir kullanıcı id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await User.findOne({ _id: _id, isActive: true })

            if (!value)
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await User.find({ isActive: true })

            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Add User Process
 */
router.post('/user-add', checkAuth, async (req, res) => {
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
                createdId: req.user.id,
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(201).send({ status: true, message: 'Kullanıcı Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Update User Process
 */
router.post('/user-update', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;
        // string ifadeyi formatla
        const firstname = formatString(req.body.firstname);
        const lastname = formatString(req.body.lastname)
        const email = req.body.email

        if (!firstname || firstname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı adı boş olamaz.', data: null });
        if (!lastname || lastname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı soyadı boş olamaz.', data: null });
        if (!email || email === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı e-posta boş olamaz.', data: null });

        // E-posta adresinin geçerliliğini kontrol et
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: 'Geçersiz bir e-posta adresi.', data: null });

        // title alanını unique olarak kontrol et
        if (await User.findOne({ email: email, title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu e-posta zaten kullanılmaktadır. Lütfen başka bir e-posta deneyin.', data: null });

        // gelen id değerini kontrol et
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // kaydı düzenle
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.updatedAt = new Date();
        user.updatedId = req.user.id;

        // kaydı güncelle
        await user.save();

        res.status(200).send({ status: true, message: 'Kullanıcı güncellendi.', data: user });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Update User Process
 */
router.post('/user-password-update', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;
        const password = req.body.password.trim()

        if (!password || password === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı şifresi boş olamaz.', data: null });

        // gelen id değerini kontrol et
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // password hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // kaydı düzenle
        user.password = hashedPassword;
        user.updatedAt = new Date();
        user.updatedId = req.user.id;

        // kaydı güncelle
        await user.save();

        res.status(200).send({ status: true, message: 'Kullanıcı güncellendi.', data: user });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});


/**
 * Delete User Process
 */
router.post('/user-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir kullanıcı id giriniz.', data: null });

        // gelen id değerini kontrol et
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // kaydı düzenle
        user.isActive = false;
        user.updatedAt = new Date();
        user.updatedId = req.user.id;

        // kaydı güncelle
        await user.save();

        res.status(200).send({ status: true, message: 'Kullanıcı silindi.', data: user });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;