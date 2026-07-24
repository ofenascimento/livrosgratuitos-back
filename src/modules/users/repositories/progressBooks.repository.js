const User = require('../../../models/User');

exports.addToReadingList = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $addToSet: { readingList: bookId } }, { new: true });

exports.removeFromReadingList = (userId, bookId) =>
  User.findByIdAndUpdate(userId, { $pull: { readingList: bookId } }, { new: true });

exports.findByIdWithReadingList = (userId) =>
  User.findById(userId).populate('readingList');

exports.findById = (userId) => User.findById(userId);

exports.save = (userDoc) => userDoc.save();

exports.updateEpubProgress = (userId, bookId, clamped, cfi) =>
  User.updateOne(
    { _id: userId, 'readingProgressEpub.bookId': bookId },
    {
      $set: {
        'readingProgressEpub.$.progress': clamped,
        ...(typeof cfi === 'string' ? { 'readingProgressEpub.$.cfi': cfi } : {}),
      },
    }
  );

exports.pushEpubProgress = (userId, bookId, clamped, cfi) =>
  User.updateOne(
    { _id: userId },
    {
      $push: {
        readingProgressEpub: {
          bookId,
          progress: clamped,
          ...(typeof cfi === 'string' ? { cfi } : {}),
        },
      },
    }
  );

exports.findByIdSelectEpubProgress = (userId) =>
  User.findById(userId, 'readingProgressEpub');