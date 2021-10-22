const express = require('express');
const router = express.Router()
const upload = require('../multer')

const userController = require("../controllers/user.controller")

const authMiddleware = require('../middleware/authMiddleware');

router.post("/login", userController.user_login)

router.get("/users", authMiddleware.isAdmin, userController.user_getAll)

router.get("/", authMiddleware.isAuth, userController.user_get)

router.delete("/:userId", authMiddleware.isAdmin, userController.user_delete)

router.patch("/:userId", authMiddleware.isAuth, upload.single("avatar"), userController.user_patch)

router.post("/register", userController.user_post)




module.exports = router;