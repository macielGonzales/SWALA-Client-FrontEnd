const router = require('express').Router()
const usuarioController = require('../controllers/UsuarioController')
const auth = require('../middleware/auth')


router.post('/register', usuarioController.register)
router.post('/login', usuarioController.login)
router.get('/logout', usuarioController.logout)
router.get('/refresh_token', usuarioController.refreshToken)
router.get('/infor', auth, usuarioController.getUser)
router.patch('/addCart', auth, usuarioController.addCart)


module.exports = router