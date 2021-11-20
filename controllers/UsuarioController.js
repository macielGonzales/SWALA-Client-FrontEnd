const usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usuarioController = {

  register: async (req, res) => {
    try {
      const { nombre, email, contraseña } = req.body;

      const user = await usuario.findOne({ email });
      if (user) return res.status(400).json({ msg: "El email ya existe." });

      if (contraseña.length < 6)
        return res
          .status(400)
          .json({ msg: "La contraseña tiene que ser de 6 a mas caracteres." });

      //encriptacion de contraseña

      const contraseñaHash = await bcrypt.hash(contraseña, 10);
      const newUsuario = new usuario({
        nombre,
        email,
        contraseña: contraseñaHash,
      });

      //guardar el usuario en mongoDB
      await newUsuario.save();

      //Procedemos a crear el jsonwebtoken para la autentificacion
      const accessToken = createAccessToken({ id: newUsuario._id });
      const refreshToken = createRefreshToken({ id: newUsuario._id });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          path: '/usuario/refresh_token'
      })

      res.json({ accessToken });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const {email, contraseña} = req.body;
      
      const user = await usuario.findOne({email})
      if(!user) return res.status(400).json({msg: "Usuario no existe."})

      const isMatch = await bcrypt.compare(contraseña, user.contraseña)
      if(!isMatch) return res.status(400).json({msg: "Contraseña incorrecta"})

      //si la sesion es exitosa, entonces se crea el token y refresh token
      // res.json({msg: "Inicio de sesion exitoso"})

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          path: '/usuario/refresh_token'
      })

      res.json({accessToken})
      
    } catch (err) {
      return res.status(500).json({msg: err.message})   
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken',{path:'/usuario/refresh_token'})
      return res.json({msg:'Cession cerrada'})
      
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }

  },

  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if(!rf_token) return res.status(400).json({ msg:"Favor de iniciar nuevamente sesion o registrarse"})

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(400).json({msg: "Favor de iniciar sesion nuevamente o registrarse"})
        const accessToken = createAccessToken({id: user.id})
        res.json({user, accessToken})
      })

      res.json({accessToken})

    } catch (err) {
       return res.status(500).json({msg: err.message})
    }
     
     
  },

  getUser: async (req, res) => {
    try {
      // res.json(req.user)
      const user = await usuario.findById(req.user.id).select('-contraseña')
      if(!user) return res.status(400).json({msg: "Usuario no existe"})
      res.json(user)
      
    } catch (error) {
      return res.status(500).json({msg:err.message})
      
    }
  },

  addCart: async (req, res) => {
    try {
      const user = await usuario.findById(req.user.id)
      if(!user) return res.status(400).json({msg: "User does not exist"})

      await usuario.findOneAndUpdate({_id: req.user.id}, {
        cart: req.body.cart
      })

      return res.json({msg: "Added to cart"})
      
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});  
}

module.exports = usuarioController;
