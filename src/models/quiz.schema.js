const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Q&A", "Poll"], required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
