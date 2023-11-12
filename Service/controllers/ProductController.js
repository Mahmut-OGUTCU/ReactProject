// ProductController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString, isNumber } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Get All Product Values Process
 */
router.post('/product-get', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // id tipi kontrol et
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await Product.findOne({ _id: _id, isActive: true })
                .populate('category', 'title');

            if (!value)
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await Product.find({ isActive: true })
                .populate('category', 'title');
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Add Product Process
 */
router.post('/product-add', checkAuth, async (req, res) => {
    try {
        // string ifadeyi formatla
        const title = formatString(req.body.title);
        const img = req.body.img;
        const price = req.body.price;
        const categoryid = req.body.category;

        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });
        if (!img || img === "")
            return res.status(400).send({ status: false, message: 'Görsel boş olamaz.', data: null });
        if (!price || price === "")
            return res.status(400).send({ status: false, message: 'Fiyat boş olamaz.', data: null });
        if (!isNumber(price)) {
            return res.status(400).send({ status: false, message: 'Fiyat sayı olmalıdır.', data: null });
        }

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(categoryid))
            return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

        // title alanını unique olarak kontrol et
        if (!(await Category.findOne({ _id: categoryid, isActive: true })))
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // title boşsa veya gönderilmemişse hata ver
        if (!title)
            return res.status(400).send({ status: false, message: 'Başlık alanı boş bırakılamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Product.findOne({ title: title, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // kaydı düzenle
        const value = new Product(
            {
                title: title,
                img: img,
                price: price,
                category: categoryid,
                createdAt: new Date(),
                createdId: null,
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Ürün Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Ürün kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Update Product Process
 */
router.post('/product-update', checkAuth, async (req, res) => {
    try {
        // if (!req.user.isAdmin)
        //     return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // string ifadeyi formatla
        const title = formatString(req.body.title);
        const _id = req.body._id;
        const img = req.body.img;
        const price = req.body.price;
        const categoryid = req.body.category._id;

        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });
        if (!img || img === "")
            return res.status(400).send({ status: false, message: 'Görsel boş olamaz.', data: null });
        if (!price || price === "")
            return res.status(400).send({ status: false, message: 'Fiyat boş olamaz.', data: null });

        // kategori id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(categoryid))
            return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

        // title alanını unique olarak kontrol et
        if (!(await Category.findOne({ _id: categoryid, isActive: true })))
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // title boşsa veya gönderilmemişse hata ver
        if (!title)
            return res.status(400).send({ status: false, message: 'Başlık alanı boş bırakılamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Product.findOne({ title: title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });


        // gelen id değerini kontrol et
        const product = await Product.findOne({ _id: _id, isActive: true });
        if (!product)
            return res.status(400).send({ status: false, message: 'Ürün bulunamadı.', data: null });

        // kaydı düzenle
        product.title = title;
        product.img = img;
        product.price = price;
        product.categoryid = categoryid;
        product.updatedAt = new Date();
        product.updatedId = null;

        // kaydı güncelle
        await product.save();

        res.status(200).send({ status: true, message: 'Ürün güncellendi.', data: product });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Ürün güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Delete Product Process
 */
router.post('/product-delete', checkAuth, async (req, res) => {
    try {
        // if (!req.user.isAdmin)
        //     return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

        // gelen id değerini kontrol et
        const product = await Product.findOne({ _id: _id, isActive: true });
        if (!product)
            return res.status(400).send({ status: false, message: 'Ürün bulunamadı.', data: null });

        // kaydı düzenle
        product.isActive = false;
        product.updatedAt = new Date();
        product.updatedId = null;

        // kaydı güncelle
        await product.save();

        res.status(200).send({ status: true, message: 'Ürün silindi.', data: product });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Ürün silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;