async function getPublicLivro(req, res) {
    const response = {
        titulo: res.livro.titulo,
        autor: res.livro.autor,
        descricao: res.livro.descricao,
        categoria: res.livro.categoria,
        capa: res.livro.capa,
        txt: res.livro.txt,
        pdf: res.livro.pdf,
        _id: res.livro.id
    };

    if (res.livro.urlHtml) {
        response.urlHtml = res.livro.urlHtml;
    }

    if (res.livro.slug) {
        response.slug = res.livro.slug;
    }

    res.json(response);
}

module.exports = getPublicLivro;
