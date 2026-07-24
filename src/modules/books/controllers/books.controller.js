const catchAsync = require('../../../utils/catchAsync');
const booksService = require('../services/books.service');

exports.createLivro = catchAsync(async (req, res) => {
  const novoLivro = await booksService.createLivro(req.body);
  res.status(201).json(novoLivro);
});

exports.updateLivro = catchAsync(async (req, res) => {
  const livroAtualizado = await booksService.updateLivro(res.livro, req.body);
  res.json(livroAtualizado);
});

exports.deleteLivro = catchAsync(async (req, res) => {
  await booksService.deleteLivro(res.livro);
  res.json({ message: 'Livro deletado' });
});

exports.getLivros = catchAsync(async (req, res) => {
  const livros = await booksService.getLivros(req.query);
  res.json(livros);
});

exports.getPublicLivros = catchAsync(async (req, res) => {
  const livros = await booksService.getPublicLivros(req.query);
  res.json(livros);
});

exports.getLivrosComPdf = catchAsync(async (req, res) => {
  const livros = await booksService.getLivrosComPdf();
  res.json(livros);
});

exports.getPublicLivro = catchAsync(async (req, res) => {
  const response = booksService.getPublicLivro(res.livro);
  res.json(response);
});

exports.getLivro = catchAsync(async (req, res) => {
  const response = await booksService.getLivro(res.livro, req.params.userId, req.user.id);
  res.json(response);
});

exports.getBookBySlug = catchAsync(async (req, res) => {
  const response = await booksService.getBookBySlug(req.params.slug, req.params.userId);
  res.json(response);
});