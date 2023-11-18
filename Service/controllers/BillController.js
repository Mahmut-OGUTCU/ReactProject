// BillController.js
const Bill = require('../models/Bill');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString, isValidPhoneNumber, phoneNumberFormat } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Fatura kayıtlarını getiren işlev
 * id parametresi gelmiş ise ilgili tek kayıt döner
 * id parametresi gelmemiş ise tüm kayıtlar döner
 */
router.post('/bill-get', checkAuth, async (req, res) => {
    try {
        // gelen id değerini al
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // eğer id değeri varsa tek kayıt getir
            if (!mongoose.Types.ObjectId.isValid(_id))
                // id tipi kontrol et
                return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await Bill.findOne({ _id: _id, isActive: true });

            if (!value)
                // gelen id veritabanında eşleşmediysa
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await Bill.find({ isActive: true });

            // başarılı bir şekilde dönüt ver
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        // herhangi bir hata ile karşılaşılması durumunda
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Fatura kaydı işlevi
 * kayıt ekleme sonrası eklenen kaydı geri dön
 */
router.post('/bill-add', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const customerName = formatString(req.body.customerName);
        let customerPhoneNumber = isValidPhoneNumber(req.body.customerPhoneNumber)
        customerPhoneNumber = phoneNumberFormat(customerPhoneNumber)
        const paymentMode = formatString(req.body.paymentMode)
        const cartItems = req.body.cartItems
        const subTotal = req.body.subTotal;
        const tax = req.body.tax;
        const totalAmount = req.body.totalAmount;

        // gelen değerlerin doğrulamalarının kontrolü
        if (!customerName || customerName === "")
            return res.status(400).send({ status: false, message: 'Müşteri ismi boş olamaz.', data: null });
        if (!customerPhoneNumber || customerPhoneNumber === "")
            return res.status(400).send({ status: false, message: 'Müşteri numarası boş olamaz.', data: null });
        if (!paymentMode || paymentMode === "")
            return res.status(400).send({ status: false, message: 'Ödeme yöntemi boş olamaz.', data: null });
        if (!cartItems || cartItems.length < 1)
            return res.status(400).send({ status: false, message: 'Nesne boş olamaz.', data: null });
        if (!subTotal || subTotal === "")
            return res.status(400).send({ status: false, message: 'Ara toplam boş olamaz.', data: null });
        if (!tax || tax === "")
            return res.status(400).send({ status: false, message: 'KDV boş olamaz.', data: null });
        if (!totalAmount || totalAmount === "")
            return res.status(400).send({ status: false, message: 'Genel toplam boş olamaz.', data: null });

        // gelen değerlere göre Fatura kaydı oluştur
        const value = new Bill(
            {
                customerName: customerName,
                customerPhoneNumber: customerPhoneNumber,
                paymentMode: paymentMode,
                cartItems: cartItems,
                subTotal: subTotal,
                tax: tax,
                totalAmount: totalAmount,
                createdAt: new Date(), // kaydın anlık olarak kayıt zamanını tut
                createdId: req.user.id, // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut
                updatedAt: null,
                updatedId: null,
            }
        );

        // kaydı ekle
        await value.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Fatura Eklendi.', data: value });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Fatura kaydı sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Fatura güncelleme işlevi
 * kayıt güncelleme sonrası eklenen kaydı geri dön
 */
router.post('/bill-update', checkAuth, async (req, res) => {
    try {
        // gelen değerleri formatlayarak al
        const _id = formatString(req.body.id);
        const customerName = formatString(req.body.customerName);
        let customerPhoneNumber = isValidPhoneNumber(req.body.customerPhoneNumber)
        customerPhoneNumber = phoneNumberFormat(customerPhoneNumber)
        const paymentMode = formatString(req.body.paymentMode)
        const cartItems = req.body.cartItems
        const subTotal = req.body.subTotal;
        const tax = req.body.tax;
        const totalAmount = req.body.totalAmount;

        // gelen değerlerin doğrulamalarının kontrolü
        if (!customerName || customerName === "")
            return res.status(400).send({ status: false, message: 'Müşteri ismi boş olamaz.', data: null });
        if (!customerPhoneNumber || customerPhoneNumber === "")
            return res.status(400).send({ status: false, message: 'Müşteri numarası boş olamaz.', data: null });
        if (!paymentMode || paymentMode === "")
            return res.status(400).send({ status: false, message: 'Ödeme yöntemi boş olamaz.', data: null });
        if (!cartItems || cartItems.length < 1)
            return res.status(400).send({ status: false, message: 'Nesne boş olamaz.', data: null });
        if (!subTotal || subTotal === "")
            return res.status(400).send({ status: false, message: 'Ara toplam boş olamaz.', data: null });
        if (!tax || tax === "")
            return res.status(400).send({ status: false, message: 'KDV boş olamaz.', data: null });
        if (!totalAmount || totalAmount === "")
            return res.status(400).send({ status: false, message: 'Genel toplam boş olamaz.', data: null });


        // gelen id değeriyle ilgili kaydı güncellemek üzere bul
        const bill = await Bill.findOne({ _id: _id, isActive: true });
        if (!bill)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Fatura bulunamadı.', data: null });

        // veritabanındaki kaydı yeni değerler ile güncelle
        bill.customerName = customerName;
        bill.customerPhoneNumber = customerPhoneNumber;
        bill.paymentMode = paymentMode;
        bill.cartItems = cartItems;
        bill.subTotal = subTotal;
        bill.tax = tax;
        bill.totalAmount = totalAmount;
        bill.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        bill.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await bill.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Fatura güncellendi.', data: bill });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Fatura güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Fatura silme işlevi
 * kayıt silme sonrası eklenen kaydı geri dön
 */
router.post('/bill-delete', checkAuth, async (req, res) => {
    try {
        if (!req.user.isAdmin)
            return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        // gelen id değerini al
        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

        // gelen id değeriyle ilgili kaydı silmek üzere bul
        const bill = await Bill.findOne({ _id: _id, isActive: true });
        if (!bill)
            // gelen id veritabanında eşleşmediyse
            return res.status(400).send({ status: false, message: 'Fatura bulunamadı.', data: null });

        // kaydı düzenle
        bill.isActive = false; // silmek için aktif hal false yapılır
        bill.updatedAt = new Date(); // kaydın anlık olarak kayıt zamanını tut
        bill.updatedId = req.user.id; // kaydı ekleyen kullanıcın id'sini middleware sayesinde tut

        // kaydı güncelle
        await bill.save();

        // başarılı olarak dönüt ver
        res.status(200).send({ status: true, message: 'Fatura silindi.', data: bill });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Fatura silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;