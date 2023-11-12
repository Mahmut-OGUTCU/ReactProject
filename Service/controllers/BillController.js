// BillController.js
const Bill = require('../models/Bill');
const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const { formatString, isValidPhoneNumber, phoneNumberFormat } = require('../helper/utils');
const checkAuth = require('../middleware');

/**
 * Get All Bill Values Process
 */
router.post('/bill-get', checkAuth, async (req, res) => {
    try {
        const _id = req.body.id;

        if (_id !== "" && _id) {
            // id tipi kontrol et
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

            // Eğer "_id" değeri varsa ilgili kaydı getir
            const value = await Bill.findOne({ _id: _id, isActive: true });

            if (!value)
                return res.status(400).send({ status: false, message: 'Geçersiz bir değer girildi.', data: null });

            res.status(200).send({ status: true, message: 'Kayıt listelendi.', data: value });
        } else {
            // "_id" değeri yoksa, tüm kayıtları getirin
            const values = await Bill.find({ isActive: true });
            res.status(200).send({ status: true, message: 'Kayıt(lar) listelendi.', data: values });
        }
    } catch (err) {
        res.status(500).send(`Verileri getirme sırasında bir hata oluştu. Hata: ${err}`);
    }
});

/**
 * Add Bill Process
 */
router.post('/bill-add', checkAuth, async (req, res) => {
    try {
        // string ifadeyi formatla
        const customerName = formatString(req.body.customerName);
        let customerPhoneNumber = isValidPhoneNumber(req.body.customerPhoneNumber)
        customerPhoneNumber = phoneNumberFormat(customerPhoneNumber)
        const paymentMode = formatString(req.body.paymentMode)
        const cardItems = req.body.cardItems
        const subTotal = req.body.subTotal;
        const tax = req.body.tax;
        const totalAmount = req.body.totalAmount;

        if (!customerName || customerName === "")
            return res.status(400).send({ status: false, message: 'Müşteri ismi boş olamaz.', data: null });
        if (!customerPhoneNumber || customerPhoneNumber === "")
            return res.status(400).send({ status: false, message: 'Müşteri numarası boş olamaz.', data: null });
        if (!paymentMode || paymentMode === "")
            return res.status(400).send({ status: false, message: 'Ödeme yöntemi boş olamaz.', data: null });
        if (!cardItems || cardItems.length < 1)
            return res.status(400).send({ status: false, message: 'Nesne boş olamaz.', data: null });
        if (!subTotal || subTotal === "")
            return res.status(400).send({ status: false, message: 'Ara toplam boş olamaz.', data: null });
        if (!tax || tax === "")
            return res.status(400).send({ status: false, message: 'KDV boş olamaz.', data: null });
        if (!totalAmount || totalAmount === "")
            return res.status(400).send({ status: false, message: 'Genel toplam boş olamaz.', data: null });

        // kaydı düzenle
        const value = new Bill(
            {
                customerName: customerName,
                customerPhoneNumber: customerPhoneNumber,
                paymentMode: paymentMode,
                cardItems: cardItems,
                subTotal: subTotal,
                tax: tax,
                totalAmount: totalAmount,
                createdAt: new Date(),
                createdId: null,
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
 * Update Bill Process
 */
router.post('/bill-update', checkAuth, async (req, res) => {
    try {
        // string ifadeyi formatla
        const _id = formatString(req.body.id);
        const customerName = formatString(req.body.customerName);
        let customerPhoneNumber = isValidPhoneNumber(req.body.customerPhoneNumber)
        customerPhoneNumber = phoneNumberFormat(customerPhoneNumber)
        const paymentMode = formatString(req.body.paymentMode)
        const cardItems = req.body.cardItems
        const subTotal = req.body.subTotal;
        const tax = req.body.tax;
        const totalAmount = req.body.totalAmount;

        if (!customerName || customerName === "")
            return res.status(400).send({ status: false, message: 'Müşteri ismi boş olamaz.', data: null });
        if (!customerPhoneNumber || customerPhoneNumber === "")
            return res.status(400).send({ status: false, message: 'Müşteri numarası boş olamaz.', data: null });
        if (!paymentMode || paymentMode === "")
            return res.status(400).send({ status: false, message: 'Ödeme yöntemi boş olamaz.', data: null });
        if (!cardItems || cardItems.length < 1)
            return res.status(400).send({ status: false, message: 'Nesne boş olamaz.', data: null });
        if (!subTotal || subTotal === "")
            return res.status(400).send({ status: false, message: 'Ara toplam boş olamaz.', data: null });
        if (!tax || tax === "")
            return res.status(400).send({ status: false, message: 'KDV boş olamaz.', data: null });
        if (!totalAmount || totalAmount === "")
            return res.status(400).send({ status: false, message: 'Genel toplam boş olamaz.', data: null });


        // gelen id değerini kontrol et
        const bill = await Bill.findOne({ _id: _id, isActive: true });
        if (!bill)
            return res.status(400).send({ status: false, message: 'Fatura bulunamadı.', data: null });

        // kaydı düzenle
        bill.customerName = customerName;
        bill.customerPhoneNumber = customerPhoneNumber;
        bill.paymentMode = paymentMode;
        bill.cardItems = cardItems;
        bill.subTotal = subTotal;
        bill.tax = tax;
        bill.totalAmount = totalAmount;
        bill.updatedAt = new Date();
        bill.updatedId = null;

        // kaydı güncelle
        await bill.save();

        res.status(200).send({ status: true, message: 'Fatura güncellendi.', data: bill });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Fatura güncellemesi sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

/**
 * Delete Bill Process
 */
router.post('/bill-delete', checkAuth, async (req, res) => {
    try {
               // if (!req.user.isAdmin)
        //     return res.status(400).send({ status: false, message: 'Sadece admin yetkisi silebilir.', data: null });

        const _id = req.body.id;

        // id tipi kontrol et
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send({ status: false, message: 'Geçerli bir ürün id giriniz.', data: null });

        // gelen id değerini kontrol et
        const bill = await Bill.findOne({ _id: _id, isActive: true });
        if (!bill)
            return res.status(400).send({ status: false, message: 'Fatura bulunamadı.', data: null });

        // kaydı düzenle
        bill.isActive = false;
        bill.updatedAt = new Date();
        bill.updatedId = null;

        // kaydı güncelle
        await bill.save();

        res.status(200).send({ status: true, message: 'Fatura silindi.', data: bill });
    } catch (err) {
        // hata alınması durumunda başarısız olarak dönüt ver
        res.status(500).send({ status: false, message: `Fatura silme sırasında bir hata oluştu. Hata: ${err}`, data: null });
    }
});

module.exports = router;