const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, ref: "categories" },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stockQuantity: { type: Number, required: true },
    image: { type: Array, required: true }
})


module.exports = mongoose.model("books", bookSchema);