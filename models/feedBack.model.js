const mongoose = require("mongoose");

const feedBackSchema = new mongoose.Schema({
    bookId: { type: String, required: true },
    comments: [Object],
});

module.exports = mongoose.model("feedBack", feedBackSchema, "feedBack");