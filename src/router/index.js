const express = require("express");
const router = express.Router();

const authRoute = require("./auth.router");
const quizRoute = require("./quiz.router");

router.use("/auth", authRoute);
router.use("/quiz", quizRoute);

module.exports = router;
