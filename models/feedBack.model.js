const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema({
    bookId: { type: String, required: true, ref: "books" },
    comments: [{ type: Object, user: { type: mongoose.Schema.Types.ObjectId, }, voted: Number, message: String, createAt: Date, ref: "users" }],
});


module.exports = mongoose.model("feedbacks", feedBackSchema);