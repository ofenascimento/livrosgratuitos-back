const User = require('../../../models/User');

exports.addFinishedBook = (userId, bookId) =>
  User.findByIdAndUpdate(
    userId,
    { $addToSet: { finishedBooks: bookId }, $pull: { readingList: bookId } },
    { new: true }
  );

exports.removeFinishedBook = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $pull: { finishedBooks: bookId } }, { new: true });

exports.findByIdWithFinished = (userId) =>
  User.findById(userId).populate('finishedBooks');

exports.save = (userDoc) => userDoc.save();