const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    }
    ,
    email : {
        type : String,
        unique : true,
        required : true,
        trim : true
    },

    password : {
        type : String,
        minlength : 8,
        required : true,
        trim : true
    },

    cart : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId , ref : "Product"
            },
            quantity : {
                type : Number,
                default : 1
            }

        },

    
    ] ,

    role: {
        type: String
    }
})

const User = mongoose.model("User" , userSchema);

module.exports = User ;