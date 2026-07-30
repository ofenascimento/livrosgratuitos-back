require('dotenv').config();
require('../config/env');
const app = require('./app');
const connectDB = require('../config/database');
const logger = require('./utils/logger');

const port = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost';

connectDB().then(() => {
  app.listen(port, () => {
    logger.info(`Servidor iniciado na porta ${port}`);
    logger.info(`API rodando em: http://${hostname}:${port}`);
  });
});