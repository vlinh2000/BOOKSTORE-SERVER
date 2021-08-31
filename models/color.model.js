const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
    colorName: { type: String, required: true },
    colorCode: { type: String, required: true },
});

module.exports = mongoose.model("colors", colorSchema, "colors");