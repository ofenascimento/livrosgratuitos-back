const express = require("express");
const router = express.Router();
const getLivroByID = require("../middlewares/getLivroByID");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

const getLivros = require("../controllers/livro/getLivros");
const getLivro = require("../controllers/livro/getLivro");

const getPublicLivros = require("../controllers/livro/getPublicLivros");
const getPublicLivro = require("../controllers/livro/getPublicLivro");

const updateLivro = require("../controllers/livro/updateLivro");
const createLivro = require("../controllers/livro/createLivro");
const deleteLivro = require("../controllers/livro/deleteLivro");
const getLivrosComPdf = require("../controllers/livro/getPDFs");
const getBySlug = require("../middlewares/getBySlug");

router.get("/public", getPublicLivros);
router.get("/public/pdfs", getLivrosComPdf);
router.get("/public/:bookId/", getLivroByID, getPublicLivro);

router.get("/public/content/:slug/", getBySlug, getPublicLivro);
router.get("/content/:slug/:userId", verifyToken, getBySlug, getLivro);

router.get("/", verifyToken, getLivros);
router.get("/:bookId/:userId", verifyToken, getLivroByID, getLivro);

router.post("/", verifyAdmin, createLivro);
router.put("/:id", verifyAdmin, getLivroByID, updateLivro);
router.delete("/:id", verifyAdmin, getLivroByID, deleteLivro);

module.exports = router;
