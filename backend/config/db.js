const mongoose = require('mongoose');

const connectDB = async () => {
    try{ 
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true, as a new version of mongodb we dont need it
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.log('MongoDB connection failed:',error.message);
        process.exit(1);
    }
}

module.exports = connectDB;