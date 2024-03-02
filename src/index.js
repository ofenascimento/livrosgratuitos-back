require('dotenv').config();
const express = require("express");
const connectDB = require("../config/database");
const cors = require('cors');

const LivrosRouter = require('./routes/livros');
const UserRouter = require('./routes/users');

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/livros', LivrosRouter);
app.use('/users', UserRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('\x1b[32m',`Servidor iniciado na porta ${port}`, '\x1b[0m');
});
