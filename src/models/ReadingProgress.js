const mongoose = require("mongoose");

const readingProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    livroId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livro",
      required: true,
      index: true,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    currentLocation: {
      type: String,
      default: "",
    },
    currentChapter: {
      type: String,
      default: "",
    },
    currentHref: {
      type: String,
      default: "",
    },
    currentCfi: {
      type: String,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

readingProgressSchema.index({ userId: 1, livroId: 1 }, { unique: true });

module.exports = mongoose.model("ReadingProgress", readingProgressSchema);