const express = require('express');
const router = express.Router()
const colorController = require("../controllers/color.controller")

const authMiddleware = require('../middleware/authMiddleware');


router.get("/", colorController.color_getAll)

// router.get("/:colorId", colorController.color_get)

// router.post("/", authMiddleware.isAdmin, colorController.color_post)

// router.patch("/:colorId", authMiddleware.isAdmin, colorController.color_patch)

// router.delete("/:colorId", authMiddleware.isAdmin, colorController.color_delete)


module.exports = router;