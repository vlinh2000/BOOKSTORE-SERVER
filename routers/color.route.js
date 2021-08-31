const express = require('express');
const router = express.Router()
const colorController = require("../controllers/color.controller")

router.get("/", colorController.color_getAll)

router.get("/:colorId", colorController.color_get)

router.post("/", colorController.color_post)

router.patch("/:colorId", colorController.color_patch)

router.delete("/:colorId", colorController.color_delete)


module.exports = router;