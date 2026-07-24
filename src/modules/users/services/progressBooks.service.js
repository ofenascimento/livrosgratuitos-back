const progressBooksRepository = require('../repositories/progressBooks.repository');
const NotFoundError = require('../../../utils/errors/NotFoundError');
const AppError = require('../../../utils/AppError');

exports.addBookToReadingList = (userId, bookId) =>
  progressBooksRepository.addToReadingList(userId, bookId);

exports.removeBookToReadingList = (userId, bookId) =>
  progressBooksRepository.removeFromReadingList(userId, bookId);

exports.getReadingList = async (userId) => {
  const user = await progressBooksRepository.findByIdWithReadingList(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.readingList.map((book) => {
    const progressItem = user.readingProgress.find((item) => item.bookId.equals(book._id));
    return {
      _id: book._id,
      titulo: book.titulo,
      autor: book.autor,
      descricao: book.descricao,
      categoria: book.categoria,
      capa: book.capa,
      txt: book.txt,
      progress: progressItem?.progress ?? 0,
      progressPercentage: progressItem?.progressPercentage ?? 0,
    };
  });
};

exports.saveProgressBook = async (userId, body) => {
  const { bookId, progress, progressPercentage, currentParagraph } = body;

  const user = await progressBooksRepository.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));

  if (index > -1) {
    user.readingProgress[index].progress = progress;
    user.readingProgress[index].progressPercentage = progressPercentage;
    user.readingProgress[index].currentParagraph = currentParagraph;
  } else {
    user.readingProgress.push({ bookId, progress, progressPercentage, currentParagraph });
  }

  await progressBooksRepository.save(user);
};

exports.getProgressBook = async (userId, bookId) => {
  const user = await progressBooksRepository.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const progressItem = user.readingProgress.find((item) => item.bookId.equals(bookId));
  if (!progressItem) throw new NotFoundError('Progresso de leitura não encontrado');

  return {
    bookId: progressItem.bookId,
    progress: progressItem.progress,
    progressPercentage: progressItem.progressPercentage,
  };
};

exports.saveEpubProgress = async (userId, body) => {
  const { progress, cfi, bookId } = body;

  if (!bookId || typeof progress !== 'number') {
    throw new AppError('bookId e progress são obrigatórios', 400);
  }

  const clamped = Math.max(0, Math.min(100, progress));

  const updateExisting = await progressBooksRepository.updateEpubProgress(userId, bookId, clamped, cfi);

  if (updateExisting.matchedCount === 0) {
    await progressBooksRepository.pushEpubProgress(userId, bookId, clamped, cfi);
  }

  const user = await progressBooksRepository.findByIdSelectEpubProgress(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  return user.readingProgressEpub.find((e) => String(e.bookId) === String(bookId));
};

exports.getEpubProgress = async (userId, bookId) => {
  const user = await progressBooksRepository.findByIdSelectEpubProgress(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const entry = user.readingProgressEpub.find((e) => e.bookId.toString() === bookId);
  if (!entry) throw new NotFoundError('Progresso não encontrado');

  return entry;
};