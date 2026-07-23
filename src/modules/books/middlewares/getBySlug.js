const Livro = require('../../../models/Livro');

async function getBySlug(req, res, next) {
    try {
        const livro = await Livro.findOne({ slug: req.params.slug });

        if (!livro) {
            return res.status(404).json({ message: 'Não foi possível encontrar o livro' });
        }

        res.livro = livro;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

module.exports = getBySlug;
