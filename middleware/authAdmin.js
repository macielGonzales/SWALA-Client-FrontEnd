const usuario = require('../models/Usuario')

const authAdmin = async (req, res, next) => {
    try {
        const user = await usuario.findOne({
            _id: req.user.id
        })

        if(user.rol===0)
            return res.status(400).json({msg: "Acceso a Administrador denegado"})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin