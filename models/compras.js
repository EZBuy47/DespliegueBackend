const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    nameVendedor: {
        type: String,
        required: true
    },
    idVendedor: {
        type: String,
        required: true
    },
    idProduct: {
        type: String,
        required: true
    },
    nameComprador: {
        type: String,
        required: true
    },
    idComprador: {
        type: String,
        required: true,
    },
    CantidadComprada: {
        type: String,
        required: true,
    },
    TotalPago: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Compra', userSchema);