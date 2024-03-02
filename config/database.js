const mongoose = require("mongoose")

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, 
        socketTimeoutMS: 45000, 
      };
    try {
        await mongoose.connect(process.env.MONGO_URI, options)
        console.log('\x1b[33m','MongoDB Conectado!', '\x1b[0m');
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB;