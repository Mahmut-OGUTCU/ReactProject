const BaseEntity = require('./BaseEntity');
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstname: { type: String, require: true },
        lastname: { type: String, require: true },
        email: { type: String, require: true },
        password: { type: String, require: true },
        token: { type: String, require: false },
        lastlogin: { type: Date, require: true },
        isAdmin: { type: Boolean, default: false },

        ...BaseEntity,
    },
)
module.exports = mongoose.model("User", userSchema);