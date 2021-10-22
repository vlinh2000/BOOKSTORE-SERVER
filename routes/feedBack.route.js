const express = require('express');
const router = express.Router()
const feedBackController = require("../controllers/feedBack.controller")

const authMiddleware = require('../middleware/authMiddleware');



router.get("/", feedBackController.feedBack_getAll)

router.get("/:bookId", feedBackController.feedBack_get)

router.post("/", authMiddleware.isAuth, feedBackController.feedBack_post)


// router.delete("/:evaluatedId", authMiddleware.isAdmin, evaluatedController.evaluated_delete)


module.exports = router;