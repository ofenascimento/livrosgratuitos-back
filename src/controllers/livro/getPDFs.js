const Livro = require('../../models/Livro');

async function getLivrosComPdf(req, res) {
    try {
        const livrosComPdf = await Livro.find({ pdf: { $exists: true, $ne: "" } })
            .select("titulo autor descricao categoria capa pdf");

        res.json(livrosComPdf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = getLivrosComPdf;
