const express = require('express');
const router = express.Router()
const userController = require("../controllers/user.controller")

const authMiddleware = require('../middleware/authMiddleware');


router.get("/users", authMiddleware.isAdmin, userController.user_getAll)

router.get("/user", authMiddleware.isAuth, userController.user_get)

router.delete("user/:userId", authMiddleware.isAdmin, userController.user_delete)

router.patch("/user/:userId", authMiddleware.isAuth, userController.user_patch)

router.post("/register", userController.user_post)

router.post("/login", userController.user_login)



module.exports = router;