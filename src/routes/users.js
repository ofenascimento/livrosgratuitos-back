const express = require('express');
const router = express.Router();

const UserController = require("../controllers/user/UserController");
const { addFavorite, removeFavorite } = require("../controllers/user/favoriteLivro")

router.put('/register', UserController.register);
router.post('/login', UserController.login);

router.put('/:userId/favorites', addFavorite);
router.delete('/:userId/favorites/:bookId', removeFavorite);

module.exports = router;