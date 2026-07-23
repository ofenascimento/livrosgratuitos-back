
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
    if (req.body.capa != null) {
        res.livro.capa = req.body.capa;
    }
    if (req.body.txt != null) {
        res.livro.txt = req.body.txt;
    }
    if (req.body.pdf != null) {
        res.livro.pdf = req.body.pdf;
    }
    if (req.body.epub != null) {
        res.livro.epub = req.body.epub;
    }

    try {
        const livroAtualizado = await res.livro.save();
        res.json(livroAtualizado);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = updateLivro;