const mongoose = require('mongoose')

const Producto = new mongoose.Schema({
    producto_id:{
        type: String,
        unique: true, 
        trim: true,
        required: true
    },
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    precio:{
        type: Number,
        trim: true,
        required: true
    },
    descripcion:{
        type: String,
        required: true
    },
    contenido:{
        type: String,
        required: true,
    },
    imagen:{
        type: Object,
        required: true,
    },
    categoria:{
        type: String,
        required: true,
    },
    check:{
        type: Boolean,
        default: false,
    },
    sold:{
        type: Number,
        default: 0
    }

}, {
    timestamps: true //important
})

module.exports = mongoose.model("Producto", Producto, "productos")