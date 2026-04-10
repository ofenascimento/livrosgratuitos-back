const User = require("../../models/User");

async function addBookToReadingList(req, res) {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  try {
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { readingList: bookId } },
      { new: true }
    );
    res.status(200).json({ message: "Livro adicionado a lista de leitura" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function removeBookToReadingList(req, res) {
  const userId = req.params.userId;
  const bookId = req.body.bookId;

  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { readingList: bookId } },
      { new: true }
    );

    res.status(200).json({ message: "Livro removido da lista de leitura" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getReadingList(req, res) {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("readingList");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const readingList = user.readingList.map((book) => {
      const progressItem = user.readingProgress.find((item) =>
        item.bookId.equals(book._id)
      );
      return {
        _id: book._id,
        titulo: book.titulo,
        autor: book.autor,
        descricao: book.descricao,
        categoria: book.categoria,
        capa: book.capa,
        txt: book.txt,
        progress: book.progress ?? 0,
        progressPercentage: progressItem?.progressPercentage ?? 0,
      };
    });
    res.json(readingList);
  } catch (error) {
    console.error("Erro ao obter lista de leitura", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

async function saveProgressBook(req, res) {
  const { bookId, progress, progressPercentage, currentParagraph } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const index = user.readingProgress.findIndex((item) =>
      item.bookId.equals(bookId)
    );

    if (index > -1) {
      user.readingProgress[index].progress = progress;
      user.readingProgress[index].progressPercentage = progressPercentage;
      user.readingProgress[index].currentParagraph = currentParagraph;
    } else {
      user.readingProgress.push({
        bookId,
        progress,
        progressPercentage,
        currentParagraph,
      });
    }

    await user.save();

    res.status(200).json({ mensagem: "Progresso salvo com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao salvar o progresso", erro: error.message });
  }
}

async function getProgressBook(req, res) {
  const { userId, bookId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const progressItem = user.readingProgress.find((item) =>
      item.bookId.equals(bookId)
    );

    if (progressItem) {
      const progressResponse = {
        bookId: progressItem.bookId,
        progress: progressItem.progress,
        progressPercentage: progressItem.progressPercentage,
      };

      res.status(200).json(progressResponse);
    } else {
      res.status(404).json({ mensagem: "Progresso de leitura não encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: "Erro ao recuperar o progresso", erro: error.message });
  }
}

async function saveEpubProgress(req, res) {
  try {
    const { userId,  } = req.params;
    const { progress, cfi, bookId } = req.body;

    if (!userId)
      return res.status(401).json({ ok: false, error: "Unauthenticated" });
    if (!bookId || typeof progress !== "number") {
      return res
        .status(400)
        .json({ ok: false, error: "bookId e progress são obrigatórios" });
    }

    const clamped = Math.max(0, Math.min(100, progress));

    const updateExisting = await User.updateOne(
      { _id: userId, "readingProgressEpub.bookId": bookId },
      {
        $set: {
          "readingProgressEpub.$.progress": clamped,
          ...(typeof cfi === "string"
            ? { "readingProgressEpub.$.cfi": cfi }
            : {}),
        },
      }
    );

    if (updateExisting.matchedCount === 0) {
      await User.updateOne(
        { _id: userId },
        {
          $push: {
            readingProgressEpub: {
              bookId,
              progress: clamped,
              ...(typeof cfi === "string" ? { cfi } : {}),
            },
          },
        }
      );
    }

    const user = await User.findById(userId, "readingProgressEpub");
    const entry = user.readingProgressEpub.find(
      (e) => String(e.bookId) === String(bookId)
    );

    return res.json({ ok: true, data: entry });
  } catch (err) {
    console.error("saveEpubProgress error:", err);
    return res.status(500).json({ ok: false, error: "Erro interno" });
  }
}

async function getEpubProgress(req, res) {
  try {
    const { userId, bookId } = req.params;

    if (!userId)
      return res.status(400).json({ ok: false, error: "userId é obrigatório" });
    if (!bookId)
      return res.status(400).json({ ok: false, error: "bookId é obrigatório" });

    const user = await User.findById(userId, "readingProgressEpub");
    if (!user)
      return res
        .status(404)
        .json({ ok: false, error: "Usuário não encontrado" });

    const entry = user.readingProgressEpub.find(
      (e) => e.bookId.toString() === bookId
    );
    if (!entry)
      return res
        .status(404)
        .json({ ok: false, error: "Progresso não encontrado" });

    return res.json({ ok: true, data: entry });
  } catch (err) {
    console.error("getEpubProgress error:", err);
    return res.status(500).json({ ok: false, error: "Erro interno" });
  }
}

module.exports = {
  addBookToReadingList,
  removeBookToReadingList,
  getReadingList,
  saveProgressBook,
  getProgressBook,
  saveEpubProgress,
  getEpubProgress,
};
