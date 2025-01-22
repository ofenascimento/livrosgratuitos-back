const express = require('express');

const router = express.Router();

const userController = require("../controllers/user/UserController");
const favoriteBookController = require("../controllers/user/favoriteBookController");
const progressBookController = require("../controllers/user/progressBookController");
const finishedBookController = require("../controllers/user/finishedBookController");

const verifyUser = require("../midllewares/verifyUser");
const verifyToken = require('../midllewares/verifyToken');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.delete('/delete-user/:userId', verifyToken, verifyUser, userController.deleteUser);
router.post('/recover-password', userController.recovePassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/:userId', verifyToken, verifyUser, userController.getUser)
router.put('/:userId', verifyToken, verifyUser, userController.updateUser)

router.post('/:userId/reading-list', verifyToken, verifyUser, progressBookController.addBookToReadingList);
router.get('/:userId/reading-list', progressBookController.getReadingList);
router.delete('/:userId/reading-list', verifyToken, verifyUser, progressBookController.removeBookToReadingList)

router.post('/:userId/save-progress', verifyToken, verifyUser, progressBookController.saveProgressBook);
router.get('/reading-progress/:userId/:bookId', verifyToken, verifyUser, progressBookController.getProgressBook);

router.put('/:userId/favorites', verifyToken, verifyUser, favoriteBookController.addFavorite);
router.delete('/:userId/favorites/:bookId', verifyToken, verifyUser, favoriteBookController.removeFavorite);
router.get('/:userId/favorite-books', verifyToken, verifyUser, favoriteBookController.getFavoriteBooks);

router.put('/:userId/finished', verifyToken, verifyUser, finishedBookController.addFinishedBook);
router.delete('/:userId/finished/:bookId', verifyToken, verifyUser, finishedBookController.removeFinishedBook);
router.get('/:userId/finished-books', verifyToken, verifyUser, finishedBookController.getFinishedBooks);

module.exports = router;