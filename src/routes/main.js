// En main.js de rutas, le indicamos a la aplicacion donde
// o quien maneja las rutas. Esto es QUE Controlador los hace.
// Por eso debemos Requerirlo al modulo

const express = require('express');

// Libreria de Multer
const multer = require('multer');

//Requerimos los controladores
const mainController = require('../controllers/mainController');
const productosController = require('../controllers/productosController');

// Trabajamos con el Express-Validator para las validaciones. Tomamos los valores
// del BODY
const { body } = require('express-validator');

//Definimos la variable router quien nos va a rutear los pedidos al controlados
const router = express.Router();         

//requerimos el MDW para validaciones de usuarios
const authMiddleware = require('../middlewares/authMiddleware');
const { Router } = require('express');
//const { TimeoutError } = require('sequelize/types');
//const validacionesRegistroMdw = require('../middlewares/validacionesRegistroMdw');

//Implementamos las validaciones. Todas en un arreglo.
//Validaciones Registro
//console.log(body.pwd_reg);
//console.log(body.pwdrepeat);
const validacionesRegistro = [
    body('email_reg').isEmail().withMessage('Formato inválido de Email'),
    body('pwd_reg').isLength({ min: 3}).withMessage('La contraseña debe tener mínimo 3 caracteres'),
    //body('pwd_reg').equals('pwdrepeat').withMessage('Las contraseñas deben coincidir')
];


//Validaciones Login
const validateLogin = [
    body('usuario_email').notEmpty().withMessage('Debe ingresar su email'),
    body('password_log').notEmpty().withMessage('Debe ingresar su password')
];

//Validaciones AltaProducto
const validateAltaProducto = [
    //body('nombreArtista').notEmpty().withMessage('Debe ingresar el nombre del Artista').bail(),
    body('nombreDisco').notEmpty().withMessage('Debe ingresar el nombre del Disco'),
    body('precio').notEmpty().withMessage('Debe ingresar el precio del producto'),
    body('precio').isNumeric().withMessage('El precio debe ser numérico'),
    body('stock').isNumeric().withMessage('El stock debe ser numérico')

];

//Validaciones Alta Artista
const validateAltaArtista = [
    body('nombreArtista').notEmpty().withMessage('Debe ingresar nombre de Artista')
];

//Validaciones Alta Genero
const validateAltaGenero= [
    body('titulo').notEmpty().withMessage('Debe ingresar título para el Género')
];

// Rutas GET
router.get('/', mainController.home);

router.get('/login', mainController.login);

router.get('/logout', mainController.logout);

router.get('/registro', mainController.registro);

router.get('/ofertas', productosController.ofertas);

router.get('/carrito', mainController.carrito);

router.get('/productos', productosController.productos);

router.get('/productosEdit', authMiddleware, productosController.productosEdit);

router.get('/faq', mainController.faq);

router.get('/contacto', mainController.contacto);

router.get('/productoDetalle/:id', productosController.productoDetalle);

router.get('/altaProducto', productosController.altaProducto);

router.get('/borrarProducto/:id', authMiddleware, productosController.borrarProducto)

router.put('/modificarProducto/:id', authMiddleware, productosController.modificarProducto);

router.get('/busquedaAvanzada', productosController.busquedaAvanzada);

router.get('/dashboard', authMiddleware, productosController.dashboard);

router.get('/altaGenero', authMiddleware, productosController.altaGenero);

router.get('/altaArtista', authMiddleware, productosController.altaArtista);

router.get('/listadoArtistas', authMiddleware, productosController.listadoArtistas);

router.get('/listadoGeneros', authMiddleware, productosController.listadoGeneros);

router.get('/modificarProducto/:id', authMiddleware, productosController.modificarProducto);

// Rutas POST
//router.post('/registro', validacionesRegistro, mainController.postRegistro1); //con JSON
router.post('/registro', validacionesRegistro, mainController.postRegistro); //con DB

router.post('/login', validateLogin, mainController.loginPost);

//router.post('/altaProducto', authMiddleware,  productosController.altaProductoPost);
router.post('/altaProducto', authMiddleware,  validateAltaProducto, productosController.altaProductoPost);

router.post('/altaArtistaPost', validateAltaArtista, productosController.altaArtistaPost);

router.post('/altaGeneroPost', validateAltaGenero, productosController.altaGeneroPost);

//base de datos
router.get('/usuarios', mainController.listadoUsuarios);





//Devolvemos el objeto router con todas las rutas y donde encontrarlas dentro del controlador.
module.exports = router;



