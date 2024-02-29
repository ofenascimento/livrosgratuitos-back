const express = require('express');
const router = express.Router();

const UserController = require("../controllers/user/UserController");

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/delete-user/:userId', UserController.deleteUser);

router.put('/:userId/favorites', UserController.addFavorite);
router.delete('/:userId/favorites/:bookId', UserController.removeFavorite);
router.get('/:userId/favorite-books', UserController.getFavoriteBooksById);

module.exports = router;