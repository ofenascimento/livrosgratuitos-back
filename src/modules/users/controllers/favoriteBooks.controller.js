const User = require('../../../models/User');
const catchAsync = require('../../../utils/catchAsync');
const NotFoundError = require('../../../utils/errors/NotFoundError');

exports.addFavorite = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  await User.findByIdAndUpdate(userId, { $addToSet: { favoriteBooks: bookId } }, { new: true });
  res.status(200).json({ message: 'Livro adicionado aos favoritos' });
});

exports.removeFavorite = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  await User.findByIdAndUpdate(userId, { $pull: { favoriteBooks: bookId } }, { new: true });
  res.status(200).json({ message: 'Livro removido dos favoritos' });
});

exports.getFavoriteBooks = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate('favoriteBooks');

  if (!user) throw new NotFoundError('Usuário não encontrado');

  const favoriteBooks = user.favoriteBooks.map((book) => ({
    _id: book._id,
    titulo: book.titulo,
    autor: book.autor,
    descricao: book.descricao,
    categoria: book.categoria,
    capa: book.capa,
    txt: book.txt,
    slug: book.slug,
  }));

  res.json(favoriteBooks);
});