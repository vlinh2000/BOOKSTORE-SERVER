const express = require('express');
const router = express.Router()
const categoryController = require("../controllers/category.controller")

router.get("/", categoryController.category_getAll)

router.get("/:categoryId", categoryController.category_get)

router.post("/", categoryController.category_post)

router.patch("/:categoryId", categoryController.category_patch)

router.delete("/:categoryId", categoryController.category_delete)


module.exports = router;