const ReadingProgress = require('../../../models/ReadingProgress');

exports.findOneAndUpsert = (userId, bookId, data) =>
  ReadingProgress.findOneAndUpdate(
    { userId, bookId },
    data,
    { new: true, upsert: true }
  );

exports.findOne = (userId, bookId) =>
  ReadingProgress.findOne({ userId, bookId });

exports.findInProgressByUser = (userId) =>
  ReadingProgress.find({
    userId,
    progressPercentage: { $gt: 0 },
  }).populate('bookId');