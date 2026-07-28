const User = require('../../../models/User');

exports.addToReadingList = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $addToSet: { readingList: bookId } }, { new: true });

exports.removeFromReadingList = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $pull: { readingList: bookId } }, { new: true });

exports.findByIdWithReadingList = (userId) =>
  User.findById(userId).populate('readingList');