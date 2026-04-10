const express = require("express");
const router = express.Router();

const verifyToken = require("../midllewares/verifyToken");

const {
  saveProgress,
  getProgress,
} = require("../controllers/readingProgressController");

router.post("/", verifyToken, saveProgress);
router.get("/:livroId", verifyToken, getProgress);

module.exports = router;