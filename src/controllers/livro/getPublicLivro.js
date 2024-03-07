async function getPublicLivro(req, res) {

    res.json(res.livro);
}

module.exports = getPublicLivro;