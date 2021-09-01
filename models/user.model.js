const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    passWord: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    key: { type: Number, required: true, default: 1 },
    avatar: String
});

module.exports = mongoose.model("users", userSchema, "users");