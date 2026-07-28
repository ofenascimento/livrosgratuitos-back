const express = require("express");
const router = express.Router();

const userController = require("../controllers/users.controller");
const favoriteBookController = require("../controllers/favoriteBooks.controller");
const readingListController = require("../controllers/readingList.controller");
const finishedBookController = require("../controllers/finishedBooks.controller");

const verifyUser = require("../middlewares/verifyUser");
const verifyToken = require("../../../middlewares/verifyToken");
const validate = require("../../../middlewares/validate");
const { authLimiter } = require("../../../middlewares/rateLimiter");

const {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  bookIdSchema,
} = require("../validations/users.validation");

router.post("/register", authLimiter, validate(registerSchema), userController.register);
router.post("/login", authLimiter, validate(loginSchema), userController.login);
router.delete(
  "/delete-user/:userId",
  verifyToken,
  verifyUser,
  userController.deleteUser
);
router.post("/recover-password", authLimiter, validate(recoverPasswordSchema), userController.recovePassword);
router.post("/reset-password/:token", authLimiter, validate(resetPasswordSchema), userController.resetPassword);
router.get("/:userId", verifyToken, verifyUser, userController.getUser);
router.put("/:userId", verifyToken, verifyUser, validate(updateUserSchema), userController.updateUser);

router.post(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  validate(bookIdSchema),
  readingListController.addBookToReadingList
);
router.get(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  readingListController.getReadingList
);
router.delete(
  "/:userId/reading-list",
  verifyToken,
  verifyUser,
  readingListController.removeBookToReadingList
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