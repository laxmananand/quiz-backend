const express = require("express");
const router = express.Router();
const Quiz = require("../models/quiz.schema");
//const Question = require("../models/questions.schema");
const { verifyJwt } = require("../middleware/auth.middleware");

router.post("/createquiz", verifyJwt, async (req, res) => {
  try {
    const { quizName, quizType, questions, email } = req.body;
    //console.log(email);
    const quiz = await new Quiz({
      quizName,
      quizType,
      questions,
      email: email,
    });
    //await quiz.save();
    const data = await quiz.save();
    console.log(data);
    return res.status(200).json({
      id: data._id,
      message: "quiz created successfully",
      success: true,
    });
  } catch (err) {
    console.log("quiz creation failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.delete("/deletequiz/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    await Quiz.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ message: "quiz deleted successfully", success: true });
  } catch (err) {
    console.log("quiz deletion failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.get("/getquiz/:id", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    return res.status(200).json({ quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.get("/trendingQuizzes", verifyJwt, async (req, res) => {
  try {
    const email = req.query.email;
    const quiz = await Quiz.find({ email }).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({ quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.get("/userData", verifyJwt, async (req, res) => {
  try {
    const quiz = await Quiz.find({ email: req.query.email });
    const noofQuizzes = quiz.length;
    let totalQuestions = 0;
    let totalImpressions = 0;
    quiz.map((q) => {
      const noOfQuestions = q.questions.length;
      totalQuestions = totalQuestions + noOfQuestions;
      totalImpressions = totalImpressions + q.impressions;
    });
    return res.status(200).json({
      quizzes: noofQuizzes,
      questions: totalQuestions,
      impressions: totalImpressions,
      success: true,
    });
  } catch (err) {
    console.log("quiz fetching failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.get("/quizzes", verifyJwt, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ email: req.query.email });
    console.log(quizzes);
    return res.status(200).json({ quizzes, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.post("/:id/impression", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    quiz.impressions = quiz.impressions + 1;
    await quiz.save();
    return res.status(200).json({ quiz, success: true });
  } catch (err) {
    console.log("quiz impression failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.post("/:id/submit", verifyJwt, async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);
    quiz.submissions = quiz.submissions + 1;
    await quiz.save();
    return res.status(200).json({ quiz, success: true });
  } catch (err) {
    console.log("quiz submission failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).lean();
    return res.status(200).json({ ...quiz, success: true });
  } catch (err) {
    console.log("quiz fetching failed", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
});

module.exports = router;
