const router = require('express').Router()
const categoriaController = require('../controllers/CategoriaController')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/categoria')
                    .get(categoriaController.getCategorias)
                    .post( auth, authAdmin, categoriaController.createCategoria) 

router.route('/categoria/:id')
.delete(auth, authAdmin, categoriaController.deleteCategoria)
.put(auth, authAdmin, categoriaController.updateCategoria)


module.exports = router