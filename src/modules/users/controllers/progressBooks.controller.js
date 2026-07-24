const catchAsync = require('../../../utils/catchAsync');
const progressBooksService = require('../services/progressBooks.service');

exports.addBookToReadingList = catchAsync(async (req, res) => {
  await progressBooksService.addBookToReadingList(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro adicionado a lista de leitura' });
});

exports.removeBookToReadingList = catchAsync(async (req, res) => {
  await progressBooksService.removeBookToReadingList(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro removido da lista de leitura' });
});

exports.getReadingList = catchAsync(async (req, res) => {
  const readingList = await progressBooksService.getReadingList(req.params.userId);
  res.json(readingList);
});

exports.saveProgressBook = catchAsync(async (req, res) => {
  await progressBooksService.saveProgressBook(req.params.userId, req.body);
  res.status(200).json({ message: 'Progresso salvo com sucesso' });
});

exports.getProgressBook = catchAsync(async (req, res) => {
  const progress = await progressBooksService.getProgressBook(req.params.userId, req.params.bookId);
  res.status(200).json(progress);
});

exports.saveEpubProgress = catchAsync(async (req, res) => {
  const entry = await progressBooksService.saveEpubProgress(req.params.userId, req.body);
  res.json({ ok: true, data: entry });
});

exports.getEpubProgress = catchAsync(async (req, res) => {
  const entry = await progressBooksService.getEpubProgress(req.params.userId, req.params.bookId);
  res.json({ ok: true, data: entry });
});