const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const favoriteBookController = require("../controllers/favoriteBooks.controller");
const progressBookController = require("../controllers/progressBooks.controller");
const finishedBookController = require("../controllers/finishedBooks.controller");

const verifyUser = require("../middlewares/verifyUser");
const verifyToken = require("../../../middlewares/verifyToken");
const validate = require("../../../middlewares/validate");

const {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  bookIdSchema,
  saveProgressSchema,
} = require("../validations/users.validation");

router.post("/register", validate(registerSchema), userController.register);
router.post("/login", validate(loginSchema), userController.login);
router.delete(
  "/delete-user/:userId",
  verifyToken,
  verifyUser,
  userController.deleteUser
);
router.post("/recover-password", validate(recoverPasswordSchema), userController.recovePassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), userController.resetPassword);
router.get("/:userId", verifyToken, verifyUser, userController.getUser);
router.put("/:userId", verifyToken, verifyUser, validate(updateUserSchema), userController.updateUser);

router.post(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  validate(bookIdSchema),
  progressBookController.addBookToReadingList
);
router.get(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  progressBookController.getReadingList
);
router.delete(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  progressBookController.removeBookToReadingList
);

router.post(
  "/:userId/save-progress",
  verifyToken,
  verifyUser,
  validate(saveProgressSchema),
  progressBookController.saveProgressBook
);
router.get(
  "/reading-progress/:userId/:bookId",
  verifyToken,
  verifyUser,
  progressBookController.getProgressBook
);

router.put(
  "/:userId/favorites",
  verifyToken,
  verifyUser,
  validate(bookIdSchema),
  favoriteBookController.addFavorite
);
router.delete(
  "/:userId/favorites/:bookId",
  verifyToken,
  verifyUser,
  favoriteBookController.removeFavorite
);
router.get(
  "/:userId/favorite-books",
  verifyToken,
  verifyUser,
  favoriteBookController.getFavoriteBooks
);

router.put(
  "/:userId/finished",
  verifyToken,
  verifyUser,
  validate(bookIdSchema),
  finishedBookController.addFinishedBook
);
router.delete(
  "/:userId/finished/:bookId",
  verifyToken,
  verifyUser,
  finishedBookController.removeFinishedBook
);
router.get(
  "/:userId/finished-books",
  verifyToken,
  verifyUser,
  finishedBookController.getFinishedBooks
);

module.exports = router;