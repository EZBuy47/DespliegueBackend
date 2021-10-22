const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 0,
        max: 255
    },
    reference: {
        type: String,
        required: true,
        min: 0,
        max: 1024
    },
    price: {
        type: Number,
        required: true,
        minlength: 0
    },
    description: {
        type: String,
        required: true,
        minlength: 0
    },
    cuantity: {
        type: Number,
        required: true,
        minlength: 0
    },
    idUser: {
        type: String,
        required: true,
        minlength: 0
    },
    nameU:{
        type:String,
        required : true,
        minlength:0
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', userSchema);