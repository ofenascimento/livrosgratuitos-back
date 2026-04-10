require('dotenv').config();
const express = require("express");
const connectDB = require("../config/database");
const cors = require('cors');

const LivrosRouter = require('./routes/livros');
const UserRouter = require('./routes/users');
const sendSupportEmail = require('./utils/sendSupportEmail');
const readingProgressRoutes = require("./routes/readingProgress");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/livros', LivrosRouter);
app.use('/users', UserRouter);
app.use("/reading-progress", readingProgressRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Oi leitor'})
})

app.post('/send-email', (req, res) => {
    const { userEmail, userName, subject, message } = req.body;
    try {
        sendSupportEmail(userEmail, userName, subject, message );
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost'; 

app.listen(port, () => {
    console.log('\x1b[32m', `Servidor iniciado na porta ${port}`, '\x1b[0m');
    console.log('\x1b[34m', `API rodando em: http://${hostname}:${port}`, '\x1b[0m');
});
