const User = require("../../models/User")

async function getLivro(req, res) {

    const userId = req.params.userId;
    const user = await User.findById(userId).populate('readingList');

    const progressItem = user.readingProgress.find(item => item.bookId.equals(res.livro._id));

    const livroData = res.livro.toObject ? res.livro.toObject() : res.livro
    const isFavorite = user.favoriteBooks.includes(res.livro._id);
    const isFinished = user.finishedBooks.includes(res.livro._id)

    const response = {
        ...livroData, 
        ...res.progress,
        isFavorite,
        isFinished,
        progressPercentage: progressItem?.progressPercentage
    };

    res.json(response)
}

module.exports = getLivro;