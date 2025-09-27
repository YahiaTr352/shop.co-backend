const mongoose = require("mongoose");

const url = process.env.CONNECT_DB_URL;

const ConnectDB = async() => {
    try{
        await mongoose.connect(url);
        console.log("connected to mongoDB");

    }catch(error){
        console.log("failed to connect to mongoDB");
    }
}

module.exports = ConnectDB;