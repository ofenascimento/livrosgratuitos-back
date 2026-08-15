const readingProgressRepository = require('../repositories/readingProgress.repository');

exports.saveProgress = (userId, body) => {
  const { bookId, progressPercentage, currentCfi, currentHref } = body;

  return readingProgressRepository.findOneAndUpsert(userId, bookId, {
    progressPercentage,
    currentCfi,
    currentHref,
  });
};

exports.getProgress = (userId, bookId) =>
  readingProgressRepository.findOne(userId, bookId);

exports.getEpubReadingList = async (userId) => {
  const progressList = await readingProgressRepository.findInProgressByUser(userId);

  return progressList
    .filter((p) => p.bookId)
    .map((p) => ({
      _id: p.bookId._id,
      title: p.bookId.title,
      author: p.bookId.author,
      cover: p.bookId.cover,
      slug: p.bookId.slug,
      progressPercentage: p.progressPercentage,
      currentCfi: p.currentCfi,
      currentHref: p.currentHref,
    }));
};