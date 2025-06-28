const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true,'Book title is required'],
        trim : true,
        maxLength : [100,'Book title cannot have more than 100 characters']
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Author',
        required : [true,'Author name is required'],
        trim : true,
    },
    year : {
        type : Number,
        required : [true,'Publication year is required'],
        min : [1000,'Year must be atleast 1000'],
        max : [new Date().getFullYear(),'Year cannot be in the future']
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('Book',bookSchema);