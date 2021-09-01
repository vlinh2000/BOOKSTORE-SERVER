const express = require('express');
const router = express.Router()
const bookController = require("../controllers/book.controller")

const authMiddleware = require('../middleware/authMiddleware');


router.get("/", bookController.book_getAll)

router.get("/:bookId", bookController.book_get)

router.post("/", authMiddleware.isAdmin, bookController.book_post)

router.patch("/:bookId", authMiddleware.isAdmin, bookController.book_patch)

router.delete("/:bookId", authMiddleware.isAdmin, bookController.book_delete)


module.exports = router;