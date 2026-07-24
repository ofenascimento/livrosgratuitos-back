const catchAsync = require('../../../utils/catchAsync');
const finishedBooksService = require('../services/finishedBooks.service');

exports.addFinishedBook = catchAsync(async (req, res) => {
  await finishedBooksService.addFinishedBook(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro finalizado' });
});

exports.removeFinishedBook = catchAsync(async (req, res) => {
  await finishedBooksService.removeFinishedBook(req.params.userId, req.params.bookId);
  res.status(200).json({ message: 'Livro removido dos finalizados' });
});

exports.getFinishedBooks = catchAsync(async (req, res) => {
  const finishedBooks = await finishedBooksService.getFinishedBooks(req.params.userId);
  res.json(finishedBooks);
});