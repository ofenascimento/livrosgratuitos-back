const User = require('../../../models/User');

exports.addFavorite = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $addToSet: { favoriteBooks: bookId } }, { new: true });

exports.removeFavorite = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $pull: { favoriteBooks: bookId } }, { new: true });

exports.findByIdWithFavorites = (userId) =>
  User.findById(userId).populate('favoriteBooks');