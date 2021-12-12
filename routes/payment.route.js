const express = require('express');
const router = express.Router()
const paymentController = require("../controllers/payment.controller")

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../multer');


router.get("/", authMiddleware.isAuth, paymentController.payment_getAll)

router.get("/:paymentId", paymentController.payment_get)

router.post("/", authMiddleware.isAdmin, upload.single("paymentLogo"), paymentController.payment_post)

router.patch("/:paymentId", authMiddleware.isAdmin, paymentController.payment_patch)

router.delete("/:paymentId", authMiddleware.isAdmin, paymentController.payment_delete)


module.exports = router;