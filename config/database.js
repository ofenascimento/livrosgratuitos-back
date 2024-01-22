const mongoose = require("mongoose")

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000, 
      };
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, options)
        console.log(`MongoDB Conectado: ${conn.connection.host}`);

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;