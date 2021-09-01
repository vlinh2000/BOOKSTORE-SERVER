const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    evaluate: [Object],
    likedBy: [String],
    categoryId: { type: String, required: true },
    prices: [Object],
})


module.exports = mongoose.model("books", bookSchema, "books");