// CategoryController.js
const Category = require('../models/Category');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString } = require('../utils');
const checkAuth = require('../middleware');

/**
 * Get All Category Values Process
 */
router.post('/category-get', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // id tipi kontrol et
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });


            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await Category.findOne({ _id: _id, isActive: true });

            if (!value)
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await Category.find({ isActive: true });
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Add Category Process
 */
router.post('/category-add', checkAuth, async (req, res) => {
    try {
        // string ifadeyi formatla
        let title = formatString(req.body.title);

        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });

        // title boşsa veya gönderilmemişse hata ver
        if (!title)
            return res.status(400).send({ status: false, message: 'Başlık alanı boş bırakılamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Category.findOne({ title: title, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // kaydı düzenle
        const value = new Category(
            {
                title: title,
                createdAt: new Date(),
                createdId: req.user.id,
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(201).send({ status: true, message: 'Kategori Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Update Category Process
 */
router.post('/category-update', checkAuth, async (req, res) => {
    try {
        // string ifadeyi formatla
        let title = formatString(req.body.title);
        const _id = req.body.id;

        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });

        // title boşsa veya gönderilmemişse hata ver
        if (!title)
            return res.status(400).send({ status: false, message: 'Başlık alanı boş bırakılamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Category.findOne({ title: title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });


        // gelen id değerini kontrol et
        const category = await Category.findOne({ _id: _id, isActive: true });
        if (!category)
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // kaydı düzenle
        category.title = title;
        category.updatedAt = new Date();
        category.updatedId = req.user.id;

        // kaydı güncelle
        await category.save();

        res.status(200).send({ status: true, message: 'Kategori güncellendi.', data: category });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Delete Category Process
 */
router.post('/category-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

        // gelen id değerini kontrol et
        const category = await Category.findOne({ _id: _id, isActive: true });
        if (!category)
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // kaydı düzenle
        category.isActive = false;
        category.updatedAt = new Date();
        category.updatedId = req.user.id;

        // kaydı güncelle
        await category.save();

        res.status(200).send({ status: true, message: 'Kategori silindi.', data: category });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;