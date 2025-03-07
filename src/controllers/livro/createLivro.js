const Livro = require('../../models/Livro');
const slugify = require('slugify');

async function createLivro(req, res) {
    try {
        const slug = slugify(req.body.titulo, { lower: true, strict: true });

        const livro = new Livro({
            titulo: req.body.titulo,
            autor: req.body.autor,
            descricao: req.body.descricao,
            categoria: req.body.categoria,
            capa: req.body.capa,
            txt: req.body.txt,
            pdf: req.body.pdf,
            epub: req.body.epub,
            urlHtml: req.body.urlHtml,
            slug: slug,
            destaque: req.body.destaque
        });

        const novoLivro = await livro.save();
        res.status(201).json(novoLivro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = createLivro;
