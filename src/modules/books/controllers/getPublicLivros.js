const Livro = require('../../../models/Livro');

async function getPublicLivros(req, res) {
    try {
        let matchQuery = {};

        if (req.query.titulo) {
            matchQuery.titulo = { $regex: new RegExp(req.query.titulo, 'i') };
        }
        if (req.query.categoria) {
            matchQuery.categoria = { $in: req.query.categoria.split(",") };
        }
        if (req.query.autor) {
            matchQuery.autor = req.query.autor;
        }
        if (req.query.destaque) {
            matchQuery.destaque = req.query.destaque === 'true';
        }

        let pipeline = [
            { $match: matchQuery },
            { 
                $project: { 
                    titulo: 1, 
                    autor: 1, 
                    descricao: 1, 
                    categoria: 1, 
                    capa: 1,
                    urlHtml: { $ifNull: ["$urlHtml", null] },
                    slug: { $ifNull: ["$slug", null] }
                } 
            }
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

module.exports = getPublicLivros;
