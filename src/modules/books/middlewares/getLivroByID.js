const Livro = require('../../../models/Livro');

async function getLivroByID(req, res, next) {
    let livro;
    try {
        livro = await Livro.findById(req.params.bookId);
        if (livro == null) {
            return res.status(404).json({ message: 'Não foi possível encontrar o livro' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.livro = livro;
    next();
}

module.exports = getLivroByID;
