const finishedBooksRepository = require('../repositories/finishedBooks.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addFinishedBook = async (userId, bookId) => {
  const user = await finishedBooksRepository.addFinishedBook(userId, bookId);
  if (!user) throw new NotFoundError('Usuário não encontrado');
};

exports.removeFinishedBook = async (userId, bookId) => {
  const user = await finishedBooksRepository.removeFinishedBook(userId, bookId);
  if (!user) throw new NotFoundError('Usuário não encontrado');
};

exports.getFinishedBooks = async (userId) => {
  const user = await finishedBooksRepository.findByIdWithFinished(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.finishedBooks.map((book) => ({
    _id: book._id,
    title: book.title,
    author: book.author,
    description: book.description,
    categories: book.categories,
    cover: book.cover,
    txt: book.txt,
  }));
};