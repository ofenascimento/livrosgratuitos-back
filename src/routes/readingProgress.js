const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

const {
  saveProgress,
  getProgress,
  getEpubReadingList
} = require("../controllers/readingProgressController");

router.post("/", verifyToken, saveProgress);
router.get("/:livroId", verifyToken, getProgress);

router.get(
  "/:userId/epub-reading-list",
  verifyToken,
  getEpubReadingList
);

module.exports = router;