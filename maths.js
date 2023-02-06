const mongoose = require('mongoose')
const maths = new mongoose.Schema({
    firstNumber:{type:Number},
    secondNumber:{type:Number}


})

module.exports = mongoose.model('maths',maths)