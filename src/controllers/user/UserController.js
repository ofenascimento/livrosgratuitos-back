const User = require("../../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto'); 
const sendEmail = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken')

async function register(req, res) {
    try {

        const emailExist = await User.findOne({email: req.body.email})
        if(emailExist) return res.status(400).json({ message: 'E-mail já cadastrado' });

        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({ _id: savedUser._id, name: savedUser.name }, process.env.TOKEN_SECRET);

        res.status(201).header('Authorization', `Bearer ${token}`).json({ token: token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Email não encontrado' });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Senha inválida' });

        const token = jwt.sign({ _id: user._id, name: user.name, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET);
        res.status(201).header('Authorization', `Bearer ${token}`).json({ token: token });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function deleteUser(req, res) {
    const userId = req.params.userId; 

    try {
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
                capa: book.capa,
                txt: book.txt,
            };
        });
        res.json(favoriteBooks);
    } catch (error) {
        console.error('Erro ao obter livros favoritos:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

async function recovePassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({message: 'Email não encontrado'});
    }

    const resetToken = generateToken(6);
    const resetTokenExpires = Date.now() + 600000; 

    await User.updateOne({ email }, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
    });

    await sendEmail(user.email, 'Recuperação de Senha', resetToken);

    res.status(200)
    res.json({message: 'Instruções para redefinição de senha foram enviadas por e-mail.'});
}

async function resetPassword (req, res) {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
        return res.status(400).send('Token de redefinição de senha é inválido ou expirou.');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne({ _id: user._id }, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
    });

    res.status(200)
    res.json({message: 'Sua senha foi redefinida'});
}

async function saveProgressBook(req, res) {
    const { bookId, progress } = req.body;
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado" });
        }

        const index = user.readingProgress.findIndex(item => item.bookId.equals(bookId));

        if (index > -1) {
            user.readingProgress[index].progress = progress;
        } else {
            user.readingProgress.push({ bookId, progress });
        }

        await user.save();

        res.status(200).json({ mensagem: "Progresso salvo com sucesso" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao salvar o progresso", erro: error.message });
    }
}

async function getProgressBook(req, res) {
    const { userId, bookId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const progressItem = user.readingProgress.find(item => item.bookId.equals(bookId));

        if (progressItem) {
            const progressResponse = {
                bookId: progressItem.bookId,
                progress: progressItem.progress
            };

            res.status(200).json(progressResponse);
        } else {
            res.status(404).json({ mensagem: "Progresso de leitura não encontrado" });
        }
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao recuperar o progresso", erro: error.message });
    }
}

module.exports = { register, login, addFavorite, removeFavorite, getFavoriteBooksById, deleteUser, recovePassword, resetPassword, saveProgressBook, getProgressBook };