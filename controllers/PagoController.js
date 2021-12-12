const Pago = require('../models/Pago')
const Usuario = require('../models/Usuario')
const Producto = require('../models/Producto')


const pagoController = {
    getPago: async (req, res) => {
        try {
            const pago = await Pago.find()
            res.json(pago)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    crearPago: async (req,res) => {
        try {
            const usuario = await Usuario.findById(req.user.id).select('nombre email')
            if(!usuario) return res.status(400).json({msg: "Usuario no existe"})

            const {cart, pago_id, direccion} = req.body;
            const {_id, nombre, email} = usuario

            const newPago = new Pago({
                usuario_id:_id, nombre, email, cart, pago_id, direccion
            })
           await newPago.save()
            res.json({msg: "Pago exitoso"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
} 

module.exports = pagoController