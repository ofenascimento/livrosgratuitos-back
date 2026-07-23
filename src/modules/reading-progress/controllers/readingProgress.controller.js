const ReadingProgress = require('../../../models/ReadingProgress');
const catchAsync = require('../../../middlewares/catchAsync');

exports.saveProgress = catchAsync(async (req, res) => {
  const { livroId, progressPercentage, currentCfi, currentHref } = req.body;

  const progress = await ReadingProgress.findOneAndUpdate(
    {
      userId: req.user.id,
      livroId,
    },
    {
      progressPercentage,
      currentCfi,
      currentHref,
    },
    {
      new: true,
      upsert: true,
    }
  );

  res.json(progress);
});

exports.getProgress = catchAsync(async (req, res) => {
  const progress = await ReadingProgress.findOne({
    userId: req.user.id,
    livroId: req.params.livroId,
  });

  res.json(progress || null);
});

exports.getEpubReadingList = catchAsync(async (req, res) => {
  const progressList = await ReadingProgress.find({
    userId: req.user.id,
    progressPercentage: { $gt: 0 },
  }).populate('livroId');

  const epubsEmProgresso = progressList
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

  res.json(epubsEmProgresso);
});