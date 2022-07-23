// En main.js de rutas, le indicamos a la aplicacion donde
// o quien maneja las rutas. Esto es QUE Controlador los hace.
// Por eso debemos Requerirlo al modulo

const express = require('express');

const mainController = require('../controllers/mainController');
const productosController = require('../controllers/productosController');

// Trabajamos con el Express-Validator para las validaciones. Tomamos los valores
// del BODY
const { body } = require('express-validator');

//Definimos la variable router quien nos va a rutear los pedidos al controlados
const router = express.Router();         

//Implementamos las validaciones. Todas en un arreglo.
// Lo pasamos como MDW en el POST del Registro
const validacionesRegistro = [
    body('usuario_reg').isLength({ min: 8}).withMessage('El usuario no puede ser menor a 8 caracteres'),
    body('email_reg').isEmail().withMessage('Formato inválido de Email'),
    body('pwd_reg').isLength({ min: 8}).withMessage('La contraseña debe tener mínimo 8 caracteres'),
];

// Rutas GET
router.get('/', mainController.home);

router.get('/login', mainController.login);

router.get('/registro', mainController.registro);

router.get('/ofertas', mainController.ofertas);

router.get('/carrito', mainController.carrito);

router.get('/productos', productosController.productos);

router.get('/faq', mainController.faq);

router.get('/contacto', mainController.contacto);

router.get('/productoDetalle', productosController.productoDetalle);

router.get('/altaProducto', productosController.altaProducto);

// Rutas POST
router.post('/registro', validacionesRegistro, mainController.postRegistro);

//Devolvemos el objeto router con todas las rutas y donde encontrarlas dentro del controlador.
module.exports = router;



