const express = require("express");
const router = express.Router();

const getBookByID = require("../middlewares/getBookByID");
const getBookBySlug = require("../middlewares/getBookBySlug");
const verifyToken = require("../../../middlewares/verifyToken");
const verifyAdmin = require("../../../middlewares/verifyAdmin");
const validate = require("../../../middlewares/validate");

const booksController = require("../controllers/books.controller");

const { createBookSchema, updateBookSchema } = require("../validations/books.validation");

router.get("/public", booksController.getPublicBooks);
router.get("/public/pdfs", booksController.getBooksWithPdf);
router.get("/public/:bookId/", getBookByID, booksController.getPublicBook);

router.get("/public/content/:slug/", getBookBySlug, booksController.getPublicBook);
router.get("/content/:slug/:userId", verifyToken, getBookBySlug, booksController.getBookBySlug);

router.get("/", verifyToken, booksController.getBooks);
router.get("/:bookId/:userId", verifyToken, getBookByID, booksController.getBook);

router.post("/", verifyAdmin, validate(createBookSchema), booksController.createBook);
router.put("/:bookId", verifyAdmin, validate(updateBookSchema), getBookByID, booksController.updateBook);
router.delete("/:bookId", verifyAdmin, getBookByID, booksController.deleteBook);

module.exports = router;