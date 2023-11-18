// CategoryController.js
const Category = require('../models/Category');
const Product = require('../models/Product');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Kategori kayıtlarını getiren işlev
 * id parametresi gelmiş ise ilgili tek kayıt döner
 * id parametresi gelmemiş ise tüm kayıtlar döner
 */
router.post('/category-get', checkAuth, async (req, res) => {
    try {
        // gelen id değerini al
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // eğer id değeri varsa tek kayıt getir
            if (!mongoose.Types.ObjectId.isValid(_id))
                // id tipi kontrol et
                return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await Category.findOne({ _id: _id, isActive: true });

            if (!value)
                // gelen id veritabanında eşleşmediysa
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await Category.find({ isActive: true });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        // herhangi bir hata ile karşılaşılması durumunda
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Kategori kaydı işlevi
 * kayıt ekleme sonrası eklenen kaydı geri dön
 */
router.post('/category-add', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        let title = formatString(req.body.title);

        // gelen değerlerin doğrulamalarının kontrolü
        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Category.findOne({ title: title, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // gelen değerlere göre Kategori kaydı oluştur
        const value = new Category(
            {
                title: title,
                createdAt: new Date(), // kaydın anlık olarak kayıt zamanını tut
                createdId: req.user.id, // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kategori Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Kategori güncelleme işlevi
 * kayıt güncelleme sonrası eklenen kaydı geri dön
 */
router.post('/category-update', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        let title = formatString(req.body.title);
        const _id = req.body.id;

        // gelen değerlerin doğrulamalarının kontrolü
        if (!title || title === "")
            return res.status(400).send({ status: false, message: 'Başlık boş olamaz.', data: null });

        // title alanını unique olarak kontrol et
        if (await Category.findOne({ title: title, _id: { $ne: _id }, isActive: true }))
            return res.status(400).send({ status: false, message: 'Bu başlık zaten kullanılmaktadır. Lütfen başka bir başlık deneyin.', data: null });

        // gelen id değeriyle ilgili kaydı güncellemek üzere bul
        const category = await Category.findOne({ _id: _id, isActive: true });
        if (!category)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // veritabanındaki kaydı yeni değerler ile güncelle
        category.title = title;
        category.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        category.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await category.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kategori güncellendi.', data: category });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Kategori silme işlevi
 * kayıt silme sonrası eklenen kaydı geri dön
 */
router.post('/category-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // gelen id değerini al
        const _id = req.body.id;


        if (_id === "655902e3108a6319670f0db6") {
            // Tümü olan kayıttır. silinmemeli
            return res.status(400).send({ status: false, message: 'Bu kayıt silinemez!', data: null });
        }

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir kategori id giriniz.', data: null });

        // gelen id değerine ait ürün bulunması kontrolü
        const product = await Product.findOne({ category: _id, isActive: true });
        if (product)
            // eğer ürün varsa
            return res.status(400).send({ status: false, message: 'Bu kategoriye ait ürün bulunduğu için kayıt silinemez.', data: null });

        // gelen id değeriyle ilgili kaydı silmek üzere bul
        const category = await Category.findOne({ _id: _id, isActive: true });
        if (!category)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Kategori bulunamadı.', data: null });

        // kaydı düzenle
        category.isActive = false; // silmek için aktif hal false yapılır
        category.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        category.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut
        // kaydı güncelle
        await category.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Kategori silindi.', data: category });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Kategori silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;