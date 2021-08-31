const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    products: [Object],
    totalPrice: { type: Number, required: true },
    deliverDate: Date,
    receivedDate: Date,
    discount: Number
});

module.exports = mongoose.model("bills", billSchema, "bills");