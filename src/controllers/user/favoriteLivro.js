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

module.exports = { addFavorite, removeFavorite }