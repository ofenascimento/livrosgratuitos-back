
async function updateLivro(req, res) {
    if (req.body.titulo != null) {
        res.livro.titulo = req.body.titulo;
    }
    if (req.body.autor != null) {
        res.livro.autor = req.body.autor;
    }
    if (req.body.descricao != null) {
        res.livro.descricao = req.body.descricao;
    }
    if (req.body.categoria != null) {
        res.livro.categoria = req.body.categoria;
    }
    if (req.body.urlCapa != null) {
        res.livro.urlCapa = req.body.urlCapa;
    }
    if (req.body.urlConteudo != null) {
        res.livro.urlConteudo = req.body.urlConteudo;
    }

    try {
        const livroAtualizado = await res.livro.save();
        res.json(livroAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = updateLivro;