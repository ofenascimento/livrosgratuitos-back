const express = require("express");
const cors = require('cors');

const LivrosRouter = require('./modules/books/books.routes');
const UserRouter = require('./modules/users/users.routes');
const readingProgressRoutes = require('./modules/reading-progress/reading-progress.routes');
const sendSupportEmail = require('./utils/sendSupportEmail');

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/livros', LivrosRouter);
app.use('/users', UserRouter);
app.use('/reading-progress', readingProgressRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Oi leitor' });
});

app.post('/send-email', async (req, res, next) => {
    try {
        const { userEmail, userName, subject, message } = req.body;
        await sendSupportEmail(userEmail, userName, subject, message);
        res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        next(error);
    }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;