const express = require('express');
const router = express.Router()
const userController = require("../controllers/user.controller")

router.get("/", userController.user_getAll)

router.get("/:userId", userController.user_get)

router.post("/", userController.user_post)

router.patch("/:userId", userController.user_patch)

router.delete("/:userId", userController.user_delete)

router.post("/login", userController.user_login)



module.exports = router;