const Book = require('../../../models/Book');

async function getBookByID(req, res, next) {
  let book;
  try {
    book = await Book.findById(req.params.bookId);
    if (book == null) {
      return res.status(404).json({ message: 'Não foi possível encontrar o livro' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.book = book;
  next();
}

module.exports = getBookByID;