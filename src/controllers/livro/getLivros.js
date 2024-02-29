const Livro = require('../../models/Livro');

async function getLivros(req, res) {
    try {
        let matchQuery = {};

        if (req.query.titulo) {
            matchQuery.titulo = { $regex: new RegExp(req.query.titulo, 'i') };
        }
        if (req.query.categoria) {
            matchQuery.categoria = req.query.categoria;
        }
        if (req.query.autor) {
            matchQuery.autor = req.query.autor;
        }
        if (req.query.destaque) {
            matchQuery.destaque = req.query.destaque === 'true';
        }

        let pipeline = [
            { $match: matchQuery }
        ];

        if (req.query.sort === 'true') {
            
            const size = req.query.q ? parseInt(req.query.q, 10) : 10; 
            pipeline.push({ $sample: { size: size } });
        } else if (req.query.q) {
           
            const limit = parseInt(req.query.q, 10);
            pipeline.push({ $limit: limit });
        }

        const livros = await Livro.aggregate(pipeline);
        res.json(livros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getLivros;
