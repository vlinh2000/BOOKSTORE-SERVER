const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    avatar: { type: String },
    comments: [{ type: Object, uid: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

module.exports = mongoose.model("feedBack", feedBackSchema);