// BaseEntity.js
const mongoose = require("mongoose");

const baseEntitySchema = {
    createdAt: { type: Date, required: false },
    createdId: { type: mongoose.Schema.Types.ObjectId, required: false },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, required: false },
    updatedId: { type: mongoose.Schema.Types.ObjectId, required: false },
};

module.exports = baseEntitySchema;
