const Livro = require('../../models/Livro');

async function createLivro(req, res) {
    const livro = new Livro({
        titulo: req.body.titulo,
        autor: req.body.autor,
        descricao: req.body.descricao,
        categoria: req.body.categoria,
        urlCapa: req.body.urlCapa,
        urlConteudo: req.body.urlConteudo,
        destaque: req.body.destaque
    })

    try {
        const novoLivro = await livro.save();
        res.status(201).send(novoLivro);
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = createLivro;

