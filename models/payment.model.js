const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    holder: { type: String, required: true },
    accountNumber: { type: String, required: true },
    paymentLogo: { type: String, required: true }
});

module.exports = mongoose.model("payments", paymentSchema);