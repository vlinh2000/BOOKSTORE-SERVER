const express = require('express');
const router = express.Router()
const billController = require("../controllers/bill.controller")


router.get("/", billController.bill_getAll)   //isAuth

router.get("/:billId", billController.bill_get)

router.post("/", billController.bill_post)

router.patch("/:billId", billController.bill_patch)

// router.delete("/:billId", billController.bill_delete)


module.exports = router;