const ReadingProgress = require('../../../models/ReadingProgress');

exports.findOneAndUpsert = (userId, livroId, data) =>
  ReadingProgress.findOneAndUpdate(
    { userId, livroId },
    data,
    { new: true, upsert: true }
  );

exports.findOne = (userId, livroId) =>
  ReadingProgress.findOne({ userId, livroId });

exports.findInProgressByUser = (userId) =>
  ReadingProgress.find({
    userId,
    progressPercentage: { $gt: 0 },
  }).populate('livroId');