const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    evaluate: { type: Array },
    likedBy: { type: Array },
    categoryId: { type: String, required: true },
    prices: [{ type: Object, required: true }],
})


module.exports = mongoose.model("books", bookSchema, "books");