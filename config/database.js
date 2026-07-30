const mongoose = require("mongoose");
const logger = require('../src/utils/logger');

const connectDB = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  };
  try {
    await mongoose.connect(process.env.MONGO_URI, options);
    logger.info('MongoDB conectado');
  } catch (error) {
    logger.error({ err: error }, 'Erro ao conectar no MongoDB');
    process.exit(1);
  }
};

module.exports = connectDB;