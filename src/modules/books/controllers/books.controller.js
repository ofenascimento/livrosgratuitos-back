const catchAsync = require('../../../utils/catchAsync');
const booksService = require('../services/books.service');

exports.createBook = catchAsync(async (req, res) => {
  const newBook = await booksService.createBook(req.body);
  res.status(201).json(newBook);
});

exports.updateBook = catchAsync(async (req, res) => {
  const updatedBook = await booksService.updateBook(res.book, req.body);
  res.json(updatedBook);
});

exports.deleteBook = catchAsync(async (req, res) => {
  await booksService.deleteBook(res.book);
  res.json({ message: 'Livro deletado' });
});

exports.getBooks = catchAsync(async (req, res) => {
  const books = await booksService.getBooks(req.query);
  res.json(books);
});

exports.getPublicBooks = catchAsync(async (req, res) => {
  const books = await booksService.getPublicBooks(req.query);
  res.json(books);
});

exports.getBooksWithPdf = catchAsync(async (req, res) => {
  const books = await booksService.getBooksWithPdf();
  res.json(books);
});

exports.getPublicBook = catchAsync(async (req, res) => {
  const response = booksService.getPublicBook(res.book);
  res.json(response);
});

exports.getBook = catchAsync(async (req, res) => {
  const response = await booksService.getBook(res.book, req.params.userId, req.user.id);
  res.json(response);
});

exports.getBookBySlug = catchAsync(async (req, res) => {
  const response = await booksService.getBookBySlug(req.params.slug, req.params.userId);
  res.json(response);
});