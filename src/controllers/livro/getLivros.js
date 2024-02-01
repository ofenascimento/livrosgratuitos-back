const Livro = require('../../models/Livro');

async function getLivros(req, res) {
    try {
        let query = {};

        if (req.query.titulo) {
            query.titulo = { $regex: new RegExp(req.query.titulo, 'i') };
        }
        if (req.query.categoria) {
            query.categoria = req.query.categoria;
        }
        if (req.query.autor) {
            query.autor = req.query.autor;
        }
        if (req.query.destaque) {
            query.destaque = req.query.destaque === 'true'
        }

        const livros = await Livro.find(query);
        res.json(livros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getLivros;
