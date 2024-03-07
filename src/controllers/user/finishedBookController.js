const User = require("../../models/User")

async function addFinishedBook(req, res) {
    const userId = req.params.userId;
    const bookId = req.body.bookId;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { finishedBooks: bookId } },
            { new: true }
        );
        res.status(200).json({ message: 'Livro finalizado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    ;
}

async function removeFinishedBook(req, res) {
    const userId = req.params.userId;
    const bookId = req.params.bookId;

    try {
        await User.findByIdAndUpdate(
            userId,
            { $pull: { finishedBooks: bookId } },
            { new: true }
        );
        res.status(200).json({ message: 'Livro removido dos finalizados' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getFinishedBooks(req, res) {
    const userId = req.params.userId;
    
    try {
        const user = await User.findById(userId).populate('finishedBooks');

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const finishedBooks = user.finishedBooks.map(book => {
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
        res.json(finishedBooks);
    } catch (error) {
        console.error('Erro ao obter livros finalizados:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { addFinishedBook, removeFinishedBook, getFinishedBooks }