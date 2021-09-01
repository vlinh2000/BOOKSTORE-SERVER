const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    products: [mongoose.Schema.Types.Mixed],
    totalPrice: { type: Number, required: true },
    uid: { type: String, required: true },
    deliverDate: Date,
    receivedDate: Date,
    discount: { type: Number, default: 0 },
    status: { type: String, default: "Chờ xác nhận" }
});

module.exports = mongoose.model("bills", billSchema, "bills");