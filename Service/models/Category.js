// Category.js
const mongoose = require("mongoose");
const baseEntitySchema = require("./BaseEntity");

const categorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        ...baseEntitySchema,
    }
);

module.exports = mongoose.model("Category", categorySchema);