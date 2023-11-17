// Product.js
const mongoose = require("mongoose");
const baseEntitySchema = require("./BaseEntity");

const billSchema = mongoose.Schema(
    {
        customerName: { type: String, require: true },
        customerPhoneNumber: { type: String, require: true },
        paymentMode: { type: String, require: true },
        cartItems: { type: Array, require: true },
        subTotal: { type: Number, require: true },
        tax: { type: Number, require: true },
        totalAmount: { type: Number, require: true },
        ...baseEntitySchema,
    }
)
module.exports = mongoose.model("Bill", billSchema);