const catchAsync = require('../../../utils/catchAsync');
const favoriteBooksService = require('../services/favoriteBooks.service');

exports.addFavorite = catchAsync(async (req, res) => {
  await favoriteBooksService.addFavorite(req.params.userId, req.body.bookId);
  res.status(200).json({ message: 'Livro adicionado aos favoritos' });
});

exports.removeFavorite = catchAsync(async (req, res) => {
  await favoriteBooksService.removeFavorite(req.params.userId, req.params.bookId);
  res.status(200).json({ message: 'Livro removido dos favoritos' });
});

exports.getFavoriteBooks = catchAsync(async (req, res) => {
  const favoriteBooks = await favoriteBooksService.getFavoriteBooks(req.params.userId);
  res.json(favoriteBooks);
});