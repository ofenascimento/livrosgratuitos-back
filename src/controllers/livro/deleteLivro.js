async function deleteLivro(req, res) {
    try {
        await res.livro.remove;
        res.json({message: 'Livro deletado'})
    } catch(error) {
        res.json({message: error})
    }
}

module.exports = deleteLivro;