const mongoose = require('mongoose')

const Categoria = new mongoose.Schema({
    nombre: {
        type:String,
        required: true,
        trim: true,
        unique: true
    }   
},{
    timestamps: true
})

module.exports = mongoose.model("Categoria", Categoria, "categorias")