const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    categoryId: { type: String, required: true },
    price: { type: Number, required: true },
    decription: { type: String, required: true },
    stockQuantity: { type: Number, required: true }
})


module.exports = mongoose.model("books", bookSchema, "books");