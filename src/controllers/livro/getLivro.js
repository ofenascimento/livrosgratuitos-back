const User = require("../../models/User");
const ReadingProgress = require("../../models/ReadingProgress");

async function getLivro(req, res) {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("readingList");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const livroId = res.livro._id;

    const progressItem = user.readingProgress.find((item) =>
      item.bookId.equals(livroId)
    );

    const epubProgress = await ReadingProgress.findOne({
      userId: req.user.id,
      livroId: livroId,
    });

    const livroData = res.livro.toObject ? res.livro.toObject() : res.livro;
    const isFavorite = user.favoriteBooks.includes(livroId);
    const isFinished = user.finishedBooks.includes(livroId);

    const response = {
      ...livroData,
      isFavorite,
      isFinished,
      progressPercentage: progressItem?.progressPercentage,
      progress: progressItem?.progress,
      currentParagraph: progressItem?.currentParagraph,
      epubProgress,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor." });
  }
}

module.exports = getLivro;