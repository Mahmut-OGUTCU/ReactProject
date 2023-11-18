// ProductController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString, isNumber } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Ürün kayıtlarını getiren işlev
 * id parametresi gelmiş ise ilgili tek kayıt döner
 * id parametresi gelmemiş ise tüm kayıtlar döner
 */
router.post('/product-get', checkAuth, async (req, res) => {
    try {
        // gelen id değerini al
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // eğer id değeri varsa tek kayıt getir
            if (!mongoose.Types.ObjectId.isValid(_id))
                // id tipi kontrol et
                return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir ve category title'ı da al
            const value = await Product.findOne({ _id: _id, isActive: true })
                .populate('category', 'title');

            if (!value)
                // gelen id veritabanında eşleşmediysa
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin ve category title'ı da al
            const values = await Product.find({ isActive: true })
                .populate('category', 'title');

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        // herhangi bir hata ile karşılaşılması durumunda
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Ürün kaydı işlevi
 * kayıt ekleme sonrası eklenen kaydı geri dön
 */
router.post('/product-add', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const title = formatString(req.body.title);
        const img = req.body.img;
        const price = req.body.price;
        const categoryid = req.body.category;

        // gelen değerlerin doğrulamalarının kontrolü
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

        // var olan bir kategoriden kayıt mı yapılıyor kontrolü
        if (!(await Category.findOne({ _id: categoryid, isActive: true })))
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // title alanını unique olarak kontrol et
        if (await Product.findOne({ title: title, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // gelen değerlere göre Fatura kaydı oluştur
        const value = new Product(
            {
                title: title,
                img: img,
                price: price,
                category: categoryid,
                createdAt: new Date(), // kaydın anlık olarak kayıt zamanını tut
                createdId: req.user.id, // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut
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
 * Ürün güncelleme işlevi
 * kayıt güncelleme sonrası eklenen kaydı geri dön
 */
router.post('/product-update', checkAuth, async (req, res) => {
    try {
        // if (!req.user.isAdmin)
        //     return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // gelen değerleri formatlayarak al
        const title = formatString(req.body.title);
        const _id = req.body._id;
        const img = req.body.img;
        const price = req.body.price;
        const categoryid = req.body.category._id;

        // gelen değerlerin doğrulamalarının kontrolü
        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });
        if (!img || img === "")
            return res.status(400).send({ status: false, message: 'Görsel boş olamaz.', data: null });
        if (!price || price === "")
            return res.status(400).send({ status: false, message: 'Fiyat boş olamaz.', data: null });

        // kategori id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(categoryid))
            return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

        // var olan bir kategoriden kayıt mı yapılıyor kontrolü
        if (!(await Category.findOne({ _id: categoryid, isActive: true })))
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // title alanını unique olarak kontrol et
        if (await Product.findOne({ title: title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // gelen id değeriyle ilgili kaydı güncellemek üzere bul
        const product = await Product.findOne({ _id: _id, isActive: true });
        if (!product)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Ürün bulunamadı.', data: null });

        // veritabanındaki kaydı yeni değerler ile güncelle
        product.title = title;
        product.img = img;
        product.price = price;
        product.category = categoryid;
        product.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        product.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await product.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Ürün güncellendi.', data: product });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Ürün güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Ürün silme işlevi
 * kayıt silme sonrası eklenen kaydı geri dön
 */
router.post('/product-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // gelen id değerini al
        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

        // gelen id değeriyle ilgili kaydı silmek üzere bul
        const product = await Product.findOne({ _id: _id, isActive: true });
        if (!product)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Ürün bulunamadı.', data: null });

        // kaydı düzenle
        product.isActive = false; // silmek için aktif hal false yapılır
        product.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        product.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await product.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Ürün silindi.', data: product });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Ürün silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;