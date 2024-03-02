const express = require('express');

const router = express.Router();

const UserController = require("../controllers/user/UserController");
const verifyUser = require("../midllewares/verifyUser");
const verifyToken = require('../midllewares/verifyToken');

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.delete('/delete-user/:userId', verifyToken, verifyUser, UserController.deleteUser);

router.post('/recover-password', UserController.recovePassword);
router.post('/reset-password/:token', UserController.resetPassword);

router.put('/:userId/favorites', verifyToken, verifyUser, UserController.addFavorite);
router.delete('/:userId/favorites/:bookId', verifyToken, verifyUser, UserController.removeFavorite);
router.get('/:userId/favorite-books', verifyToken, verifyUser, UserController.getFavoriteBooksById);

module.exports = router;