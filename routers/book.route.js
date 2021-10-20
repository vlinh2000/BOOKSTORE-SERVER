const express = require('express');
const router = express.Router()
const bookController = require("../controllers/book.controller")

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../multer');


router.get("/", bookController.book_getAll)

router.get("/:bookId", bookController.book_get)

router.post("/", authMiddleware.isAdmin, upload.array("image", 4), bookController.book_post)

router.patch("/:bookId", authMiddleware.isAdmin, upload.array("image", 4), bookController.book_patch)

router.delete("/:bookId", authMiddleware.isAdmin, bookController.book_delete)


module.exports = router;