const mongoose = require('mongoose')

const Usuario = new mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    contraseña:{
        type: String,
        required: true
    },
    rol:{
        type: Number,
        default: 0
    },
    cart:{
        type: Array,
        default: []
    }

}, {
    timestamps: true
   }
)

module.exports = mongoose.model('Usuario', Usuario)