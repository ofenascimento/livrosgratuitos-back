const User = require('../../../models/User');
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addFinishedBook = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { finishedBooks: bookId },
      $pull: { readingList: bookId },
    },
    { new: true }
  );

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));

  if (index > -1) {
    user.readingProgress[index].progress = 0;
    user.readingProgress[index].progressPercentage = 100;
  }

  await user.save();
  res.status(200).json({ message: 'Livro finalizado' });
});

exports.removeFinishedBook = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  const user = await User.findByIdAndUpdate(
    userId,
    { $pull: { finishedBooks: bookId } },
    { new: true }
  );

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const index = user.readingProgress.findIndex((item) => item.bookId.equals(bookId));

  if (index > -1) {
    user.readingProgress[index].progressPercentage = 0;
  }

  await user.save();
  res.status(200).json({ message: 'Livro removido dos finalizados' });
});

exports.getFinishedBooks = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('finishedBooks');

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const finishedBooks = user.finishedBooks.map((book) => ({
    _id: book._id,
    titulo: book.titulo,
    autor: book.autor,
    descricao: book.descricao,
    categoria: book.categoria,
    capa: book.capa,
    txt: book.txt,
  }));

  res.json(finishedBooks);
});