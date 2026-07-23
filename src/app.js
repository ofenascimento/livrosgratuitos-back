const express = require("express");
const cors = require('cors');

const LivrosRouter = require('./routes/livros');
const UserRouter = require('./routes/users');
const readingProgressRoutes = require("./routes/readingProgress");
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