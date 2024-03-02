const express = require('express');
const router = express.Router();
const getLivroByID = require("../midllewares/getLivroByID")
const verifyToken = require("../midllewares/verifyToken")

const getLivros = require("../controllers/livro/getLivros")
const getLivro = require("../controllers/livro/getLivro")
const updateLivro = require("../controllers/livro/updateLivro")
const createLivro = require("../controllers/livro/createLivro")
const deleteLivro = require("../controllers/livro/deleteLivro")
const verifyAdmin = require("../midllewares/verifyAdmin")

router.get('/', verifyToken, getLivros);
router.get('/:id', verifyToken, getLivroByID, getLivro);
router.post('/', verifyAdmin, createLivro);
router.put('/:id', verifyAdmin, getLivroByID, updateLivro);
router.delete('/:id', verifyAdmin, getLivroByID, deleteLivro)

module.exports = router