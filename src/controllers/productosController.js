// Traemos el File System para trabajar con JSON
const fs = require('fs');

// Guardamos el resultado de las validaciones para devolverlas en 
// el Front y una variable global para el mensaje de error del contenido del form
const {validationResult} = require('express-validator');

//Requerimos el Model Products
const modelProducts = require('../model/modelProducts');

//Seteamos la variable path para contener el path a la pagina
const path = require('path');
const { getAllProductos } = require('../model/modelProducts');
const producto = require('../model/modelProducts');
const { listeners } = require('process');

const jsonPath = path.join(__dirname,'../../database/InfoDiscos.json');

const json = JSON.parse(fs.readFileSync(jsonPath,'utf-8'));

const listadoDiscos = json.map(e => {
    return {
      
      id: e.id,
      nombreArtista: e.nombreArtista,
      nombreDisco: e.nombreDisco,
      precio: e.precio,
      stock: e.stock,
      sku: e.sku,
      categoria: e.categoria,
      vendidos: e.vendidos,
      recomendado: e.recomendado,
      img: e.img,

    }
  });

// Generamos un array con todas las letras que vamos a usar para la busqueda avanzada.
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alfabeto = alpha.map((x) => String.fromCharCode(x));

//definimos el objeto Controller
const controller = {
    productos: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      
      res.render(path.join(__dirname, '../views/products/productos'), {
        'session': userSession.userId,
        'listadoDiscos': listadoDiscos });

    //res.render(path.join(__dirname, '../views/products/productos'), {'listadoDiscos': listadoDiscos});
    },

    productosEdit: (req, res) => {
      res.render(path.join(__dirname, '../views/products/productosEdit'), {
        //'session': userSession.userId,
        'listadoDiscos': listadoDiscos });
    },

    borrarProducto: (req, res) => {

      let productoId = req.params.id;
      let msje;
      let nuevoListado = [];

      //Llamamos al modelo con id para que lo borre.
      if (modelProducts.delete(productoId)) {
          msje = 'El Producto se ha borrado';
          nuevoListado = getAllProductos;

        } else {
          msje = 'El Producto no se ha podido borrar';
      } 

      res.render(path.join(__dirname, '../views/products/productosEdit'), {
        //'session': userSession.userId,
       'msje': msje,
       'listadoDiscos': getAllProductos() });

    },

    dashboard: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  

      //Traemos algunos productos 
      res.render(path.join(__dirname, '../views/products/dashboard'), {
              'session': userSession.userId,
              'listadoDiscos': listadoDiscos });

      //res.render(path.join(__dirname, '../views/products/dashboard'));
    },

    //ALTA DE PRODUCTO
    altaProducto: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      
      if ( userSession && userSession.userId == 'administrador') {

        res.render(path.join(__dirname, '../views/products/altaProducto'), {
          'session': userSession.userId,
          'listadoDiscos': listadoDiscos });
      } else {
        res.send('Página no encontrada');
      }    
        //res.render(path.join(__dirname, '../views/products/altaProducto'));
    },
    
    //ALTA DE PRODUCTO POST
    altaProductoPost: (req, res) => {
      //Vamos a dar de alta un usuario. 
      //Creamos primero el objeto con los valores del formulario.
      const{
        nombreArtista,
        nombreDisco,
        categoria,
        precio,
        stock,
        sku,
        recomendado,
        imagen
    }=req.body;
    
     //Traemos las validaciones del Formulario de Alta de Producto
     const errores = validationResult(req);
    

     if (errores.isEmpty()) { //Todo bien en el formulario, procedemos a crear el articulo.

        //ahora validamos que el producto (SKU) no exista.
        const productoSku = modelProducts.findByField('sku', sku);

        if (productoSku) {
            //Producto Encontrado. Ya está dado de alta
            const msjeError = 'El producto ya existe';
                res.render(path.join(__dirname, '../views/products/altaProducto'), {
                    'msje': msjeError, 
                    'errores':errores.array(),
                    'prev': req.body });
        }else {
            //creamos el objeto con los valores que paso del Body y 
            const obj = {
              ...req.body,
            };
            //Llamamos al metodo de Model que da de alta el usuario
            modelProducts.create(obj);
            const msjeExito = 'Producto Creado Satisfactoriamente';
            res.render(path.join(__dirname, '../views/products/altaProducto'), {'msje': msjeExito });
        }

     }else{
        // Acá sí hubo errores en alguno de los campos de los formularios.
        // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
        // que ya traía, para que queden visualizados.
        res.render(path.join(__dirname, '../views/products/altaProducto'),{
          'errores':errores.array(),
          'prev': req.body
        })

     }
      //res.render(path.join(__dirname, '../views/products/altaProducto'));
    },

    productoDetalle: (req, res) => {
       //Preguntamos por la sesion.
       userSession = req.session;

       let productoId = req.params.id;

      //Buscamos el producto por Id. Para ello usamos el ModelProducts.
      let productoEncontrado = modelProducts.findByPk(productoId);

      if (!productoEncontrado) {
        productoEncontrado = undefined;
      }  
      //res.render(path.join(__dirname, '../views/products/productoDetalle'));
      
        res.render(path.join(__dirname, '../views/products/productoDetalle'), {
        'session': userSession.userId,
        'productoEncontrado': productoEncontrado });
    },

    busquedaAvanzada: (req, res) => {
      //Preguntamos por la sesion.
      userSession = req.session;  

      res.render(path.join(__dirname, '../views/products/busquedaAvanzada'), {
              'session': userSession.userId,
              'alfabeto': alfabeto });

      //res.render(path.join(__dirname, '../views/products/busquedaAvanzada'), {'alfabeto': alfabeto});
    },

    //OFERTAS
    ofertas: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  

      res.render(path.join(__dirname, '../views/ofertas'), {
        'session': userSession.userId,
        'listadoDiscos': listadoDiscos });

      // res.render(path.join(__dirname, '../views/ofertas'), {'listadoDiscos': listadoDiscos});
      },
}

// Finalizamos devolviendo el objeto
module.exports = controller;