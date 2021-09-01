const express = require('express');
const router = express.Router()
const categoryController = require("../controllers/category.controller")

const authMiddleware = require('../middleware/authMiddleware');


router.get("/", categoryController.category_getAll)

router.get("/:categoryId", categoryController.category_get)

router.post("/", authMiddleware.isAdmin, categoryController.category_post)

router.patch("/:categoryId", authMiddleware.isAdmin, categoryController.category_patch)

router.delete("/:categoryId", authMiddleware.isAdmin, categoryController.category_delete)


module.exports = router;