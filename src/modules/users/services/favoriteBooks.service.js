const favoriteBooksRepository = require('../repositories/favoriteBooks.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addFavorite = (userId, bookId) =>
  favoriteBooksRepository.addFavorite(userId, bookId);

exports.removeFavorite = (userId, bookId) =>
  favoriteBooksRepository.removeFavorite(userId, bookId);

exports.getFavoriteBooks = async (userId) => {
  const user = await favoriteBooksRepository.findByIdWithFavorites(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.favoriteBooks.map((book) => ({
    _id: book._id,
    titulo: book.titulo,
    autor: book.autor,
    descricao: book.descricao,
    categoria: book.categoria,
    capa: book.capa,
    txt: book.txt,
    slug: book.slug,
  }));
};