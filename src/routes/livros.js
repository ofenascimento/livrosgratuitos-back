const express = require('express');
const router = express.Router();
const getLivroByID = require("../midllewares/getLivroByID")
const verifyToken = require("../midllewares/verifyToken")
const verifyAdmin = require("../midllewares/verifyAdmin")

const getLivros = require("../controllers/livro/getLivros")
const getLivro = require("../controllers/livro/getLivro")

const getPublicLivros = require("../controllers/livro/getPublicLivros")
const getPublicLivro = require("../controllers/livro/getPublicLivro")

const updateLivro = require("../controllers/livro/updateLivro")
const createLivro = require("../controllers/livro/createLivro")
const deleteLivro = require("../controllers/livro/deleteLivro");

router.get('/public', getPublicLivros)
router.get('/public/:bookId/', getLivroByID, getPublicLivro)

router.get('/', verifyToken, getLivros);
router.get('/:bookId/:userId', verifyToken, getLivroByID, getLivro);

router.post('/', verifyAdmin, createLivro);
router.put('/:id', verifyAdmin, getLivroByID, updateLivro);
router.delete('/:id', verifyAdmin, getLivroByID, deleteLivro)

module.exports = router