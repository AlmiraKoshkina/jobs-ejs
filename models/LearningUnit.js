const mongoose = require("mongoose");

const LearningUnitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    category: {
      type: String,
      required: true,
      enum: ["programming", "design", "language", "business", "other"],
    },

    progress: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },

    targetDate: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningUnit", LearningUnitSchema);
