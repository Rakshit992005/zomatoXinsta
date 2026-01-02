const mongoose = require("mongoose")

function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(() =>{
        console.log("MongoDB connected")
    })
    .catch((err) => {
        console.log("mongoDB connection Error: " , err);
    })
}

module.exports = connectDB;