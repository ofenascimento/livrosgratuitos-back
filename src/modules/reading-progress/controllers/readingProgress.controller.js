const catchAsync = require('../../../utils/catchAsync');
const readingProgressService = require('../services/readingProgress.service');

exports.saveProgress = catchAsync(async (req, res) => {
  const progress = await readingProgressService.saveProgress(req.user.id, req.body);
  res.json(progress);
});

exports.getProgress = catchAsync(async (req, res) => {
  const progress = await readingProgressService.getProgress(req.user.id, req.params.bookId);
  res.json(progress || null);
});

exports.getEpubReadingList = catchAsync(async (req, res) => {
  const epubReadingList = await readingProgressService.getEpubReadingList(req.user.id);
  res.json(epubReadingList);
});