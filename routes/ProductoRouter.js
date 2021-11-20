const router = require('express').Router()
const productoController = require('../controllers/ProductoController')

router.route('/producto')
    .get(productoController.getProducto)
    .post(productoController.crearProducto)

router.route('/producto/:id')
    .delete(productoController.eliminarProducto)
    .put(productoController.actualizarProducto)

module.exports = router