// UserController.js
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { formatString } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Kullanıcı kayıtlarını getiren işlev
 * id parametresi gelmiş ise ilgili tek kayıt döner
 * id parametresi gelmemiş ise tüm kayıtlar döner
 */
router.post('/user-get', checkAuth, async (req, res) => {
    try {
        // gelen id değerini al
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // eğer id değeri varsa tek kayıt getir
            if (!mongoose.Types.ObjectId.isValid(_id))
                // id tipi kontrol et
                return res.status(400).send({ status: false, message: 'Geçerli bir kullanıcı id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await User.findOne({ _id: _id, isActive: true })

            if (!value)
                // gelen id veritabanında eşleşmediysa
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await User.find({ isActive: true })

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        // herhangi bir hata ile karşılaşılması durumunda
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Kullanıcı kaydı işlevi
 * kayıt ekleme sonrası eklenen kaydı geri dön
 */
router.post('/user-add', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const firstname = formatString(req.body.firstname);
        const lastname = formatString(req.body.lastname)
        const email = req.body.email
        const password = req.body.password.trim()

        // gelen değerlerin doğrulamalarının kontrolü
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

        // email alanını unique olarak kontrol et
        if (await User.findOne({ email: email, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu e-posta zaten kullanılmaktadır. Lütfen başka bir e-posta deneyin.', data: null });

        // password hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // gelen değerlere göre Kullanıcı kaydı oluştur
        const value = new User(
            {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hashedPassword,
                createdAt: new Date(), // kaydın anlık olarak kayıt zamanını tut
                createdId: req.user.id, // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kullanıcı Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Kullanıcı güncelleme işlevi
 * kayıt güncelleme sonrası eklenen kaydı geri dön
 * password güncellenmez
 */
router.post('/user-update', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const _id = req.body.id;
        const firstname = formatString(req.body.firstname);
        const lastname = formatString(req.body.lastname)
        const email = req.body.email

        // gelen değerlerin doğrulamalarının kontrolü
        if (!firstname || firstname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı adı boş olamaz.', data: null });
        if (!lastname || lastname === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı soyadı boş olamaz.', data: null });
        if (!email || email === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı e-posta boş olamaz.', data: null });

        // E-posta adresinin geçerliliğini kontrol et
        if (!isValidEmail(email))
            return res.status(400).send({ status: false, message: 'Geçersiz bir e-posta adresi.', data: null });

        // email alanını unique olarak kontrol et
        if (await User.findOne({ email: email, title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu e-posta zaten kullanılmaktadır. Lütfen başka bir e-posta deneyin.', data: null });

        // gelen id değeriyle ilgili kaydı güncellemek üzere bul
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // veritabanındaki kaydı yeni değerler ile güncelle
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        user.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await user.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kullanıcı güncellendi.', data: user });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Kullanıcı şifre güncelleme işlevi
 */
router.post('/user-password-update', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const _id = req.body.id;
        const password = req.body.password.trim()

        // gelen değerlerin doğrulamalarının kontrolü
        if (!password || password === "")
            return res.status(400).send({ status: false, message: 'Kullanıcı şifresi boş olamaz.', data: null });

        // gelen id değeriyle ilgili kaydı güncellemek üzere bul
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // password hashle
        const hashedPassword = await bcrypt.hash(password, 10);

        // veritabanındaki kaydı yeni değerler ile güncelle
        user.password = hashedPassword;
        user.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        user.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await user.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kullanıcı güncellendi.', data: null });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});


/**
 * Kullanıcı silme işlevi
 * kayıt silme sonrası eklenen kaydı geri dön
 */
router.post('/user-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // gelen id değerini al
        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir kullanıcı id giriniz.', data: null });

        // gelen id değeriyle ilgili kaydı silmek üzere bul
        const user = await User.findOne({ _id: _id, isActive: true });
        if (!user)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Kullanıcı bulunamadı.', data: null });

        // kaydı düzenle
        user.isActive = false; // silmek için aktif hal false yapılır
        user.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        user.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await user.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kullanıcı silindi.', data: user });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kullanıcı silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;