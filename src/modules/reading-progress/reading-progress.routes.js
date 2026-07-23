const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/verifyToken");
const validate = require("../../middlewares/validate");

const {
  saveProgress,
  getProgress,
  getEpubReadingList,
} = require("./controllers/readingProgress.controller");

const { saveProgressSchema } = require("./reading-progress.validation");

router.post("/", verifyToken, validate(saveProgressSchema), saveProgress);
router.get("/:livroId", verifyToken, getProgress);

router.get(
  "/:userId/epub-reading-list",
  verifyToken,
  getEpubReadingList
);

module.exports = router;