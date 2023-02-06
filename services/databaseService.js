const mongoose = require('mongoose')
const jwt =require('jsonwebtoken')
const uri = `mongodb+srv://jinchuriki:${process.env.DB_PASSWORD}@cluster0.jtkrgn0.mongodb.net/testdb`
// let URL = 'mongodb://localhost:27017/testdb'
const start = ()=>{
    mongoose.connect(uri)
    mongoose.connection.on(
        "error",()=>{
            console.log("Error Connecting DB")
        }
    )
    mongoose.connection.once(
        "Connection_OK",()=>{
            console.log('DB Connnected')
        }
    )
}




module.exports = {start}


