const mongoose = require('mongoose');
const Like = require('./likes.model');

const foodSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
    },
    video : {
        type : String,
        required : true,
    },
    description : {
        type : String
    },
    foodPartner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "foodPartner",
    },
    Like: {
        type : Number,
        default : 0,
    }
})

const foodModle = mongoose.model("food" , foodSchema);
module.exports = foodModle;