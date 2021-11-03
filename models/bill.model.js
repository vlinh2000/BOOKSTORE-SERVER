const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    products: [{ type: Object }],
    totalPrice: { type: Number, required: true },
    uid: { type: String, required: true },

    discount: { type: Number, default: 0 },
    status: { type: String, default: "Pending" },
    pay: { type: Boolean, default: false },
    traddingCode: { type: String, default: '' },

    address: String,
    receiver: String,
    phoneReceiver: String,

    createAt: { type: String },
    receivedDate: { type: String },
    canceledDate: { type: String }
});

module.exports = mongoose.model("bills", billSchema);