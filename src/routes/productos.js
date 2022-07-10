// En main.js de rutas, le indicamos a la aplicacion donde
// o quien maneja las rutas. Esto es QUE Controlador los hace.
// Por eso debemos Requerirlo al modulo

const express = require('express');
const productosController = require('../controllers/productosController');
const router = express.Router();         //Definimos la variable router quien nos va a rutear los pedidos al controlados



router.get('/:idProducto', productosController.detalle);

//Devolvemos el objeto router con todas las rutas y donde encontrarlas dentro del controlador.
module.exports = router;