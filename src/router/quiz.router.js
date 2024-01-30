const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.schema");
//const Question = require("../models/questions.schema");
const { verifyJwt } = require("../middleware/auth.middleware");

router.post("/createquiz", verifyJwt, async (req, res) => {
  try {
    const { name, type, questions, email } = req.body;
    //console.log(email);
    const quiz = await new Quiz({
      name,
      type,
      questions,
      email: email,
    });
    await quiz.save();
    return res.json({ message: "quiz created successfully", success: true });
  } catch (err) {
    console.log("quiz creation failed", err);
  }
});

router.delete("/deletequiz/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    return res.json({ message: "quiz deleted successfully", success: true });
  } catch (err) {
    console.log("quiz deletion failed", err);
  }
});

router.get("/getquiz/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    return res.json({ quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
  }
});

router.get("/trendingQuizzes", verifyJwt, async (req, res) => {
  try {
    const quiz = await Quiz.find().sort({ createdAt: -1 }).limit(5);
    return res.json({ quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
  }
});

// router.get("/userData", verifyJwt, async (req, res) => {
//   try {
//     const quiz = await Quiz.find({ email: req.user.email });
//     return res.json({ quiz, success: true });
//   } catch (err) {
//     console.log("quiz fetching failed", err);
//   }
// });

router.get("/quizzes", verifyJwt, async (req, res) => {
  try {
    const quiz = await Quiz.find();
    return res.json({ quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
  }
});

router.post("/:id/impression", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();
    return res.json({ quiz, success: true });
  } catch (err) {
    console.log("quiz impression failed", err);
  }
});

router.post("/:id/submit", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    quiz.submissions = quiz.submissions + 1;
    await quiz.save();
    return res.json({ quiz, success: true });
  } catch (err) {
    console.log("quiz submission failed", err);
  }
});

module.exports = router;
