const User = require("../../models/User")

async function addFavorite(req, res) {
    const userId = req.params.userId;
    const bookId = req.body.bookId;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { favoriteBooks: bookId } },
            { new: true }
        );
        res.status(200).json({ message: 'Livro adicionado aos favoritos' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    ;
}

async function removeFavorite(req, res) {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $pull: { favoriteBooks: bookId } },
            { new: true }
        );
        res.status(200).json({ message: 'Livro removido dos favoritos' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getFavoriteBooksById(req, res) {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('favoriteBooks');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const favoriteBooks = user.favoriteBooks.map(book => {
            return {
                _id: book._id,
                titulo: book.titulo,
                autor: book.autor,
                descricao: book.descricao,
                categoria: book.categoria,
                capa: book.capa,
                txt: book.txt,
            };
        });
        res.json(favoriteBooks);
    } catch (error) {
        console.error('Erro ao obter livros favoritos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { addFavorite, removeFavorite, getFavoriteBooksById }