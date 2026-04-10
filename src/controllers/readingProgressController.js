const ReadingProgress = require("../models/ReadingProgress");

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