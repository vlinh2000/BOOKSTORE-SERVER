const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    passWord: { type: String, required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    key: { type: Number, default: 1 },
    email: { type: String, required: true },
    avatar: { type: String, default: "" }
});

module.exports = mongoose.model("users", userSchema);