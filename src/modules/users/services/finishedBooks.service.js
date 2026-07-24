const finishedBooksRepository = require('../repositories/finishedBooks.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addFinishedBook = async (userId, bookId) => {
  const user = await finishedBooksRepository.addFinishedBook(userId, bookId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));
  if (index > -1) {
    user.readingProgress[index].progress = 0;
    user.readingProgress[index].progressPercentage = 100;
  }

  await finishedBooksRepository.save(user);
};

exports.removeFinishedBook = async (userId, bookId) => {
  const user = await finishedBooksRepository.removeFinishedBook(userId, bookId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));
  if (index > -1) {
    user.readingProgress[index].progressPercentage = 0;
  }

  await finishedBooksRepository.save(user);
};

exports.getFinishedBooks = async (userId) => {
  const user = await finishedBooksRepository.findByIdWithFinished(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.finishedBooks.map((book) => ({
    _id: book._id,
    titulo: book.titulo,
    autor: book.autor,
    descricao: book.descricao,
    categoria: book.categoria,
    capa: book.capa,
    txt: book.txt,
  }));
};