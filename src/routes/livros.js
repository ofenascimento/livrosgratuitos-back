const express = require('express');
const router = express.Router();
const getLivroByID = require("../midllewares/getLivroByID")
const verifyToken = require("../midllewares/verifyToken")

const getLivros = require("../controllers/livro/getLivros")
const getLivro = require("../controllers/livro/getLivro")
const updateLivro = require("../controllers/livro/updateLivro")
const createLivro = require("../controllers/livro/createLivro")
const deleteLivro = require("../controllers/livro/deleteLivro")

router.get('/', verifyToken, getLivros);
router.get('/:id', verifyToken, getLivroByID, getLivro);
router.post('/', createLivro);
router.put('/:id', getLivroByID, updateLivro);
router.delete('/:id', getLivroByID, deleteLivro)

module.exports = router