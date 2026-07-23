const User = require("../../../models/User");
const Livro = require("../../../models/Livro");

async function getLivroBySlug(req, res) {
    try {
        const { userId, slug } = req.params;

        const livro = await Livro.findOne({ slug });
        if (!livro) {
            return res.status(404).json({ message: "Livro não encontrado" });
        }

        const user = await User.findById(userId).populate('readingList');
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const progressItem = user.readingProgress.find(item => item.bookId.equals(livro._id));

        const isFavorite = user.favoriteBooks.includes(livro._id);
        const isFinished = user.finishedBooks.includes(livro._id);

        const response = {
            ...livro.toObject(),
            isFavorite,
            isFinished,
            progressPercentage: progressItem?.progressPercentage,
            progress: progressItem?.progress,
            currentParagraph: progressItem?.currentParagraph
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getLivroBySlug;
