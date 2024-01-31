const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    quizName: { type: String, required: true },
    quizType: { type: String, enum: ["Q & A", "Poll Type"], required: true },
    questions: {
      type: Array,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    submissions: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
