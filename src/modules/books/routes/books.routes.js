const express = require("express");
const router = express.Router();

const getLivroByID = require("../middlewares/getLivroByID");
const getBySlug = require("../middlewares/getBySlug");
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");
const validate = require("../../../middlewares/validate");

const booksController = require("../controllers/books.controller");

const { createLivroSchema, updateLivroSchema } = require("../validations/books.validation");

router.get("/public", booksController.getPublicLivros);
router.get("/public/pdfs", booksController.getLivrosComPdf);
router.get("/public/:bookId/", getLivroByID, booksController.getPublicLivro);

router.get("/public/content/:slug/", getBySlug, booksController.getPublicLivro);
router.get("/content/:slug/:userId", verifyToken, getBySlug, booksController.getBookBySlug);

router.get("/", verifyToken, booksController.getLivros);
router.get("/:bookId/:userId", verifyToken, getLivroByID, booksController.getLivro);

router.post("/", verifyAdmin, validate(createLivroSchema), booksController.createLivro);
router.put("/:bookId", verifyAdmin, validate(updateLivroSchema), getLivroByID, booksController.updateLivro);
router.delete("/:bookId", verifyAdmin, getLivroByID, booksController.deleteLivro);

module.exports = router;