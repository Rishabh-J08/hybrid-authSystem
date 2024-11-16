const mongoose = require("mongoose");
require('dotenv').config();


const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log("connected to the DB")
    } catch (error) {
     console.error("error while connceting to the DB", error);
     process.exit(1);
    }
}

module.exports = connectDb;