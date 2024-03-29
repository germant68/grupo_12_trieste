// En main.js de rutas, le indicamos a la aplicacion donde
// o quien maneja las rutas. Esto es QUE Controlador los hace.
// Por eso debemos Requerirlo al modulo

const express = require('express');
const path = require('path');

// Libreria de Multer 
const multer = require('multer');
//const uploadFile = require('../middlewares/multerMiddleware');

// Implementamos el Disk Sotrage para Img Producto
const storageProducto = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = path.join(__dirname, '../../Public/images/');
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const newFilename = file.originalname;
        cb (null, newFilename)

    }
})

const uploadFileProducto = multer({ storage: storageProducto })

// Implementamos el Disk Sotrage para Img de usuarios (Edit y Register)
const storageUsers = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = path.join(__dirname, '../../Public/images/users');
        cb(null, folder);
    },

    filename: (req, file, cb) => {
        const newFilename = file.originalname;
        cb (null, newFilename)

    }
})

// Implementamos Muleter para Img Usuario al crear el usuario
const uploadFileUsersRegister = multer({ storage: storageUsers })

// Implementamos Muleter para Img Usuario al editar el usuario
const uploadFileUsersEdit = multer({ storage: storageUsers })

// ----------- Fin de Multer -----------

//Requerimos los controladores
const mainController = require('../controllers/mainController');
const productosController = require('../controllers/productosController');

//Requerimos los controladores para la API
const apiUserController = require('../../Database/API/userController');
const apiProductosController = require('../../Database/API/productosController');

// Trabajamos con el Express-Validator para las validaciones. Tomamos los valores
// del BODY
const { body } = require('express-validator');

//Definimos la variable router quien nos va a rutear los pedidos al controlados
const router = express.Router();         

//requerimos el MDW para validaciones de usuarios y carrito
const authMiddleware = require('../middlewares/authMiddleware');
const authCarritoMiddleware = require('../middlewares/authCarritoMiddleware');

const { Router } = require('express');
//const validacionesRegistroMdw = require('../middlewares/validacionesRegistroMdw');

//Implementamos las validaciones. Todas en un arreglo.
//Validaciones Registro
const validacionesRegistro = [
    body('email_reg')
        .notEmpty().withMessage('Por favor, complete el email').bail()
        .isEmail().withMessage('Formato inválido de Email'),
    body('nombre_reg')
        .notEmpty().withMessage('Por favor complete su Nombre'),
    body('apellido_reg')
        .notEmpty().withMessage('Por favor complete su Apellido'),    
    body('pwd_reg')
        .isLength({ min: 3}).withMessage('La contraseña debe al menos 3 caracteres'),
    body('pwdrepeat')
        .notEmpty().withMessage('Debe reingresar su contraseña')
        //.equals('pwd_reg').withMessage('Las contraseñas deben coincidir')
];


//Validaciones Login
const validateLogin = [
    body('usuario_email')
        .notEmpty().withMessage('Debe ingresar su email').bail()
        .isEmail().withMessage('Ingrese un email válido'),
    body('password_log')
        .notEmpty().withMessage('Debe ingresar su password').bail()
        .isLength({min: 3}).withMessage('La contraseña debe contener mínimo 3 caracteres')
];


//Validaciones AltaProducto
const validateAltaProducto = [
    body('nombreDisco')
        .notEmpty().withMessage('Debe ingresar el nombre del Disco'),
    body('nombreArtista')
        .exists().withMessage('Debe seleccionar un Artista'),
    body('categoria')
        .exists().withMessage('Debe seleccionar un género'),
    body('precio')
        .notEmpty().withMessage('Debe ingresar el precio del producto')
        .isNumeric().withMessage('El precio debe ser numérico'),
    body('stock')
        .notEmpty().withMessage('Debe ingresar el stock del producto')
        .isNumeric().withMessage('El stock debe ser numérico')

];

//Validaciones Modificación Producto
const validateModifProd = [
    body('precio')
        .notEmpty().withMessage('El campo precio debe estar completo')
        .isNumeric({no_symbols: true}).withMessage('El campo precio debe ser un valor numérico y mayor a 0'),
    body('oferta')
        .notEmpty().withMessage('El campo oferta debe estar completo')
        .isNumeric({no_symbols: true}).withMessage('El campo oferta debe ser un valor numérico y mayor o igual a 0'),
    body('stock')
        .isNumeric({no_symbols: true}).withMessage('El campo Stock debe ser un valor numérico y mayor o igual a 0'),
];


// Validaciones Modif Usuario
const validateModifUser = [
    body('passwordNew')
        .isLength({min: 3}).withMessage('La nueva contraseña debe contener mínimo 3 caracteres')
];

// Validaciones Alta Artista
const validateAltaArtista = [
    body('nombreArtista').notEmpty().withMessage('Debe ingresar nombre de Artista')
];

// Validaciones Alta Genero
const validateAltaGenero= [
    body('titulo').notEmpty().withMessage('Debe ingresar título para el Género')
];

// Validaciones Modif

// ----------------------- Rutas GET // -----------------------
router.get('/', mainController.home);

router.get('/login', mainController.login);

router.get('/logout', mainController.logout);

router.get('/userEdit', mainController.userEdit);

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

router.get('/busquedaAvanzada', productosController.busquedaAvanzada);

router.get('/dashboard', authMiddleware, productosController.dashboard);

router.get('/altaGenero', authMiddleware, productosController.altaGenero);

router.get('/altaArtista', authMiddleware, productosController.altaArtista);

router.get('/listadoArtistas', authMiddleware, productosController.listadoArtistas);

router.get('/listadoGeneros', authMiddleware, productosController.listadoGeneros);

router.get('/modificarProducto/:id', authMiddleware, productosController.modificarProducto);

router.get('/agregarACarrito/:id', authCarritoMiddleware, productosController.agregarACarrito);

router.get('/removeItemCarrito/:id', authCarritoMiddleware, productosController.removeItemCarrito);


// ----------------------- Rutas POST // -----------------------
//router.post('/registro', validacionesRegistro, mainController.postRegistro1); //con JSON
router.post('/registro', uploadFileUsersRegister.single('imgAvatar'), validacionesRegistro, mainController.postRegistro); //con DB

router.post('/login', validateLogin, mainController.loginPost);

//router.post('/altaProducto', authMiddleware,  productosController.altaProductoPost); //con JSON
router.post('/altaProducto', uploadFileProducto.single('imagen'), authMiddleware,  validateAltaProducto, productosController.altaProductoPost);

router.post('/altaArtistaPost', validateAltaArtista, productosController.altaArtistaPost);

router.post('/altaGeneroPost', validateAltaGenero, productosController.altaGeneroPost);

router.post('/modificarProducto/:id', authMiddleware, validateModifProd, productosController.modificarProducto);

router.post('/agregarACarrito/:id', authCarritoMiddleware, productosController.agregarACarrito);

router.post('/searchResults', productosController.searchResults);

router.post('/usuarioEditPost', uploadFileUsersEdit.single('imgAvatar'), authMiddleware, validateModifUser, mainController.usuarioEditPost);



// <----- RUTAS APIs ----->
router.get('/api/productos', apiProductosController.productos);

router.get('/api/producto/:id', apiProductosController.detalleProducto);

router.get('/api/generos', apiProductosController.generos);

router.get('/api/artistas', apiProductosController.artistas);

router.get('/api/ultimoDisco', apiProductosController.ultimoDisco);

router.get('/api/usuarios', apiUserController.usuarios);

router.get('/api/usuario/:id', apiUserController.detalleUsuario);



//base de datos ---LUEGO BORRAR!!!!!
router.get('/usuarios', mainController.listadoUsuarios);

//Devolvemos el objeto router con todas las rutas y donde encontrarlas dentro del controlador.
module.exports = router;



