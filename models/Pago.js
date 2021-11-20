const mongoose = require('mongoose')

const Pago = new mongoose.Schema({ 
    usuario_id: {
        type: String,
        required: true
    },
    
    nombre: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    pago_id:{
        type: String,
        required:true
    },

    direccion: {
        type: Object,
        required: true
    },

    cart: {
        type:Array,
        default: []
    },

    status: {
        type:Boolean,
        required: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Pago", Pago, "pagos")