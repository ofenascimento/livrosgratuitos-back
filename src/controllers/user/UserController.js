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
        res.status(201).json({message: 'Usuário registrado com sucesso'})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({message: 'Email não encontrado.'});

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({message: 'Senha inválida.'});

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.status(201);
        res.header('auth-token', token).json({token: token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = { register, login };