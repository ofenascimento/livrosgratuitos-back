require('dotenv').config();
require('../config/env');
const app = require('./app');
const connectDB = require('../config/database');

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

connectDB().then(() => {
  app.listen(port, () => {
    console.log('\x1b[32m', `Servidor iniciado na porta ${port}`, '\x1b[0m');
    console.log('\x1b[34m', `API rodando em: http://${hostname}:${port}`, '\x1b[0m');
  });
});