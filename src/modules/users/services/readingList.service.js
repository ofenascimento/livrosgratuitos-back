const readingListRepository = require('../repositories/readingList.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addBookToReadingList = (userId, bookId) =>
  readingListRepository.addToReadingList(userId, bookId);

exports.removeBookToReadingList = (userId, bookId) =>
  readingListRepository.removeFromReadingList(userId, bookId);

exports.getReadingList = async (userId) => {
  const user = await readingListRepository.findByIdWithReadingList(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.readingList.map((book) => ({
    _id: book._id,
    title: book.title,
    author: book.author,
    description: book.description,
    categories: book.categories,
    cover: book.cover,
    txt: book.txt,
  }));
};