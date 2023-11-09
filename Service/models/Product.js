// Product.js
const mongoose = require("mongoose");
const baseEntitySchema = require("./BaseEntity");

const productSchema = mongoose.Schema(
    {
        title: { type: String, require: true },
        img: { type: String, require: true },
        price: { type: Number, require: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        ...baseEntitySchema,
    }
)

module.exports = mongoose.model("Product", productSchema);