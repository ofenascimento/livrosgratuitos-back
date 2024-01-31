const User = require("../../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

async function register(req, res) {
    try {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuário registrado com sucesso' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Email não encontrado.' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Senha inválida.' });

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.status(201);
        res.header('auth-token', token).json({ token: token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

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
                urlCapa: book.urlCapa,
                urlConteudo: book.urlConteudo,
            };
        });
        res.json(favoriteBooks);
    } catch (error) {
        console.error('Erro ao obter livros favoritos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

module.exports = { register, login, addFavorite, removeFavorite, getFavoriteBooksById };