const Book = require('../../../models/Book');

async function getBookBySlug(req, res, next) {
    try {
        const book = await Book.findOne({ slug: req.params.slug });

        if (!book) {
            return res.status(404).json({ message: 'Não foi possível encontrar o livro' });
        }

        res.book = book;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = getBookBySlug;
