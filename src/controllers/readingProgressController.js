const ReadingProgress = require("../models/ReadingProgress");
const User = require("../models/User");

exports.saveProgress = async (req, res) => {
  try {
    const { livroId, progressPercentage, currentCfi, currentHref } = req.body;

    const progress = await ReadingProgress.findOneAndUpdate(
      {
        userId: req.user.id,
        livroId,
      },
      {
        progressPercentage,
        currentCfi,
        currentHref,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar progresso" });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({
      userId: req.user.id,
      livroId: req.params.livroId,
    });

    console.log(progress)
    res.json(progress || null);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar progresso" });
    console.log('errou')
  }
};

exports.getEpubReadingList = async (req, res) => {
  try {
    const progressList = await ReadingProgress.find({
      userId: req.user.id,
      progressPercentage: { $gt: 0 },
    }).populate("livroId");

    const epubsEmProgresso = progressList
      .filter((p) => p.livroId)
      .map((p) => ({
        _id: p.livroId._id,
        titulo: p.livroId.titulo,
        autor: p.livroId.autor,
        capa: p.livroId.capa,
        slug: p.livroId.slug,
        progressPercentage: p.progressPercentage,
        currentCfi: p.currentCfi,
        currentHref: p.currentHref,
      }));

    res.json(epubsEmProgresso);
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};