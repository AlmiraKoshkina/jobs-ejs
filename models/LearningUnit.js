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
      default: "general",
    },

    progress: {
      type: String,
      enum: ["planned", "in-progress", "completed"], // ← как в тестах!
      default: "planned",
    },

    targetDate: {
      type: Date,
      required: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningUnit", LearningUnitSchema);
