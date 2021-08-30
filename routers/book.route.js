const express = require('express');
const router = express.Router()
const bookController = require("../controllers/book.controller")

router.get("/", bookController.book_getAll)

router.get("/:bookId", bookController.book_get)

router.post("/", bookController.book_post)

router.patch("/:bookId", bookController.book_patch)

router.delete("/:bookId", bookController.book_delete)


module.exports = router;