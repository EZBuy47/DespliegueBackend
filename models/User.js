const mongoose = require('mongoose');
const findOrCreate = require("mongoose-findorcreate");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    rol:{
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    googleId: String,
    secret: String,
    alreadyRegistered: { type: Boolean, default: false }
})

module.exports = mongoose.model('User', userSchema);