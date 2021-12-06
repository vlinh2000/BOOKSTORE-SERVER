const express = require('express');
const router = express.Router()
const billController = require("../controllers/bill.controller");
const { isAuth, isAdmin } = require('../middleware/authMiddleware');


router.get("/", isAuth, billController.bill_getAll)   //isAuth

router.get("/:billId", isAuth, billController.bill_get)

router.post("/", isAuth, billController.bill_post)

router.patch("/:billId", isAuth, billController.bill_patch)

router.delete("/:billId", isAuth, billController.bill_delele)

module.exports = router;