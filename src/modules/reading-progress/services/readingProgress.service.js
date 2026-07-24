const readingProgressRepository = require('../repositories/readingProgress.repository');

exports.saveProgress = (userId, body) => {
  const { livroId, progressPercentage, currentCfi, currentHref } = body;

  return readingProgressRepository.findOneAndUpsert(userId, livroId, {
    progressPercentage,
    currentCfi,
    currentHref,
  });
};

exports.getProgress = (userId, livroId) =>
  readingProgressRepository.findOne(userId, livroId);

exports.getEpubReadingList = async (userId) => {
  const progressList = await readingProgressRepository.findInProgressByUser(userId);

  return progressList
    .filter((p) => p.livroId)
    .map((p) => ({
      _id: p.livroId._id,
      titulo: p.livroId.titulo,
      autor: p.livroId.autor,
      capa: p.livroId.capa,
      slug: p.livroId.slug,
      progressPercentage: p.progressPercentage,
      currentCfi: p.currentCfi,
      currentHref: p.currentHref,
    }));
};