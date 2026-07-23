const User = require('../../../models/User');
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require('../../../utils/errors/NotFoundError');
const AppError = require('../../../utils/AppError');

exports.addBookToReadingList = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  await User.findByIdAndUpdate(userId, { $addToSet: { readingList: bookId } }, { new: true });
  res.status(200).json({ message: 'Livro adicionado a lista de leitura' });
});

exports.removeBookToReadingList = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  await User.findByIdAndUpdate(userId, { $pull: { readingList: bookId } }, { new: true });
  res.status(200).json({ message: 'Livro removido da lista de leitura' });
});

exports.getReadingList = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('readingList');

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const readingList = user.readingList.map((book) => {
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

  res.json(readingList);
});

exports.saveProgressBook = catchAsync(async (req, res) => {
  const { bookId, progress, progressPercentage, currentParagraph } = req.body;
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));

  if (index > -1) {
    user.readingProgress[index].progress = progress;
    user.readingProgress[index].progressPercentage = progressPercentage;
    user.readingProgress[index].currentParagraph = currentParagraph;
  } else {
    user.readingProgress.push({ bookId, progress, progressPercentage, currentParagraph });
  }

  await user.save();
  res.status(200).json({ message: 'Progresso salvo com sucesso' });
});

exports.getProgressBook = catchAsync(async (req, res) => {
  const { userId, bookId } = req.params;

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const progressItem = user.readingProgress.find((item) => item.bookId.equals(bookId));
  if (!progressItem) throw new NotFoundError('Progresso de leitura não encontrado');

  res.status(200).json({
    bookId: progressItem.bookId,
    progress: progressItem.progress,
    progressPercentage: progressItem.progressPercentage,
  });
});

exports.saveEpubProgress = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { progress, cfi, bookId } = req.body;

  if (!bookId || typeof progress !== 'number') {
    throw new AppError('bookId e progress são obrigatórios', 400);
  }

  const clamped = Math.max(0, Math.min(100, progress));

  const updateExisting = await User.updateOne(
    { _id: userId, 'readingProgressEpub.bookId': bookId },
    {
      $set: {
        'readingProgressEpub.$.progress': clamped,
        ...(typeof cfi === 'string' ? { 'readingProgressEpub.$.cfi': cfi } : {}),
      },
    }
  );

  if (updateExisting.matchedCount === 0) {
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          readingProgressEpub: {
            bookId,
            progress: clamped,
            ...(typeof cfi === 'string' ? { cfi } : {}),
          },
        },
      }
    );
  }

  const user = await User.findById(userId, 'readingProgressEpub');
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const entry = user.readingProgressEpub.find((e) => String(e.bookId) === String(bookId));

  res.json({ ok: true, data: entry });
});

exports.getEpubProgress = catchAsync(async (req, res) => {
  const { userId, bookId } = req.params;

  const user = await User.findById(userId, 'readingProgressEpub');
  if (!user) throw new NotFoundError('Usuário não encontrado');

  const entry = user.readingProgressEpub.find((e) => e.bookId.toString() === bookId);
  if (!entry) throw new NotFoundError('Progresso não encontrado');

  res.json({ ok: true, data: entry });
});