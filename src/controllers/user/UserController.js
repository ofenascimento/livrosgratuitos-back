const User = require("../../models/User")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const sendEmail = require('../../utils/sendEmail');
const generateToken = require('../../utils/generateToken')

async function register(req, res) {
    try {

        const emailExist = await User.findOne({ email: req.body.email })
        if (emailExist) return res.status(400).json({ message: 'E-mail já cadastrado' });

        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        });
        const savedUser = await newUser.save();

        const firstname = savedUser.name.split(' ')[0]

        const token = jwt.sign({ _id: savedUser._id, name: firstname }, process.env.TOKEN_SECRET);

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

        const firstname = user.name.split(' ')[0]

        const token = jwt.sign({ _id: user._id, name: firstname, isAdmin: user.isAdmin }, process.env.TOKEN_SECRET);
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

async function recovePassword(req, res) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'Email não encontrado' });
    }

    const resetToken = generateToken(6);
    const resetTokenExpires = Date.now() + 600000;

    await User.updateOne({ email }, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
    });

    await sendEmail(user.email, 'Recuperação de Senha', resetToken);

    res.status(200)
    res.json({ message: 'Instruções para redefinição de senha foram enviadas por e-mail.' });
}

async function resetPassword(req, res) {
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
    res.json({ message: 'Sua senha foi redefinida' });
}

async function getUser(req, res) {

    const { userId } = req.params

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200);
    res.json({ name: user.name, email: user.email });

}

async function updateUser(req, res) {

    const { userId } = req.params

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    user.name = req.body.name
    user.email = req.body.email

    try {
       user.save()
    } catch (error) {
        res.status(400).json({message: error})
    }

}

module.exports = {
    register,
    login,
    deleteUser,
    recovePassword,
    resetPassword,
    getUser,
    updateUser
};