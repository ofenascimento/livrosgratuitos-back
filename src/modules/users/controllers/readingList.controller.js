const catchAsync = require('../../../utils/catchAsync');
const readingListService = require('../services/readingList.service');

exports.addBookToReadingList = catchAsync(async (req, res) => {
  await readingListService.addBookToReadingList(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro adicionado a lista de leitura' });
});

exports.removeBookToReadingList = catchAsync(async (req, res) => {
  await readingListService.removeBookToReadingList(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro removido da lista de leitura' });
});

exports.getReadingList = catchAsync(async (req, res) => {
  const readingList = await readingListService.getReadingList(req.params.userId);
  res.json(readingList);
});