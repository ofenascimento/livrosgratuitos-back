const express = require("express");
const router = express.Router();

const getLivroByID = require("./middlewares/getLivroByID");
const getBySlug = require("./middlewares/getBySlug");
const verifyToken = require("../../middlewares/verifyToken");
const verifyAdmin = require("../../middlewares/verifyAdmin");
const validate = require("../../middlewares/validate");

const getLivros = require("./controllers/getLivros");
const getLivro = require("./controllers/getLivro");
const getPublicLivros = require("./controllers/getPublicLivros");
const getPublicLivro = require("./controllers/getPublicLivro");
const updateLivro = require("./controllers/updateLivro");
const createLivro = require("./controllers/createLivro");
const deleteLivro = require("./controllers/deleteLivro");
const getLivrosComPdf = require("./controllers/getPDFs");

const { createLivroSchema, updateLivroSchema } = require("./books.validation");

router.get("/public", getPublicLivros);
router.get("/public/pdfs", getLivrosComPdf);
router.get("/public/:bookId/", getLivroByID, getPublicLivro);

router.get("/public/content/:slug/", getBySlug, getPublicLivro);
router.get("/content/:slug/:userId", verifyToken, getBySlug, getLivro);

router.get("/", verifyToken, getLivros);
router.get("/:bookId/:userId", verifyToken, getLivroByID, getLivro);

router.post("/", verifyAdmin, validate(createLivroSchema), createLivro);
router.put("/:id", verifyAdmin, validate(updateLivroSchema), getLivroByID, updateLivro);
router.delete("/:id", verifyAdmin, getLivroByID, deleteLivro);

module.exports = router;