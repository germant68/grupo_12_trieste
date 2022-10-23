//Traemos la base de datos con Sequelize
const db = require('../../Database/models');

const Op = db.Sequelize.Op; // Para operadores del WHERE.

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

//Inicializamos arreglos que van a contener los datos.
let listadoDiscos = {};
let generos = [];
let artistas = [];


// Generamos un array con todas las letras que vamos a usar para la busqueda avanzada.
const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alfabeto = alpha.map((x) => String.fromCharCode(x));

//definimos el objeto Controller
const controller = {
    
    artistas: artistas,
    generos: generos,

    //LISTADO DE PRODUCTOS
    productos: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      db.Producto.findAll({
        raw : true, 
        nest: true,
        include: [{
          association: 'artista',
        }, 
        {
          association: 'genero',
        }]
      })
        .then(productos => {
          
          res.render(path.join(__dirname, '../views/products/productos'), {
            'session': userSession,
            'listadoDiscos': productos });
        })
    },

    productos1: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      
      res.render(path.join(__dirname, '../views/products/productos'), {
        'session': userSession.userId,
        'listadoDiscos': listadoDiscos });

    //res.render(path.join(__dirname, '../views/products/productos'), {'listadoDiscos': listadoDiscos});
    },

    //EDITAR PRODUCTO
    productosEdit: (req, res) => {

        //Preguntamos por la sesion.
        userSession = req.session.nombre;

        db.Producto.findAll({
          raw : true, 
          nest: true,
          include: [{
            association: 'artista',
          }, 
          {
            association: 'genero',
          }]
        })
          .then(productos => {
            
            res.render(path.join(__dirname, '../views/products/productosEdit'), {
              'session': userSession,
              'listadoDiscos': productos });
          })
      },

    //BORRAR PRODUCTO
    borrarProducto: (req, res) => {

       //Preguntamos por la sesion.
       userSession = req.session.nombre;  
       
      let productoId = req.params.id;

      //Llamamos al modelo con id para que lo borre.

      db.Producto.destroy({
             where: {
                 id: productoId
             }
         })
         .then( resultado => {

           //res.redirect(path.join(__dirname, '../views/home'));

            db.Producto.findAll({
              raw : true, 
              nest: true,
              include: [{
                association: 'artista',
              }, 
              {
                association: 'genero',
              }]
            })
              .then(productos => {
                
                res.render(path.join(__dirname, '../views/products/productosEdit'), {
                  'session': userSession,
                  'listadoDiscos': productos });
              })

        });

    },

    borrarProducto1: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;  
      
     let productoId = req.params.id;
     let msje;
     let nuevoListado = [];

     //Llamamos al modelo con id para que lo borre.
     if (modelProducts.delete(productoId)) {
         msje = 'Producto borrado correctamente';
         nuevoListado = getAllProductos;

       } else {
           msje = 'El Producto no se ha podido borrar';
     } 

     res.render(path.join(__dirname, '../views/products/productosEdit'), {
     'session': userSession,
      'msje': msje,
      'listadoDiscos': getAllProductos() });

   },

    //MODIFICAR PRODUCTO
    modificarProducto: async (req, res) => {
      
      //Preguntamos por la sesion.
      userSession = req.session.nombre;  

      //Traemos las validaciones del Formulario de Registro
      const errores = validationResult(req);
        
      if (errores.isEmpty()) {
      

        //Vamos a modificar un producto. 
        try {

          //Creamos primero el objeto con los valores del formulario QUE PUEDEN MODIFICARSE
          const {
            precio,
            stock,
            oferta,
            favorito,
          }=req.body;

          let recomendado = '';
          if ( favorito == 'on' ) {
            recomendado = 1; //Sigue como recomendado
          } else {
            recomendado = 0;  //Lo removemos de ser recomendado
          }
        
          await db.Producto.update(
              {
                  precio,
                  stock,
                  oferta,
                  recomendado,
              },
              {
                  where: {
                      id: req.params.id,
                  }
              }
          );

          let msje = 'Producto Modificado con éxito';
          //Volvemos a renderizar la vista
          db.Producto.findAll({
            raw : true, 
            nest: true,
            include: [{
              association: 'artista',
            }, 
            {
              association: 'genero',
            }]
          })
            .then(productos => {
              
              res.render(path.join(__dirname, '../views/products/productosEdit'), {
                'session': userSession,
                'msje': msje,
                'errores': errores.array(),
                'listadoDiscos': productos });
            })
            
        } catch (error) {
            let msje = 'Error Modificando el Producto. Vuelva a intentar...';
            
            res.render(path.join(__dirname, '../views/products/productosEdit'), {
              'session': userSession,
              'msje': msje,
              'errores': errores.array(),
              'listadoDiscos': productos });
            
        }

      } else {
        
          //Volvemos a renderizar la vista
          db.Producto.findAll({
            raw : true, 
            nest: true,
            include: [{
              association: 'artista',
            }, 
            {
              association: 'genero',
            }]
          })
            .then(productos => {

            console.log(errores.array());
            res.render(path.join(__dirname, '../views/products/productosEdit'), {
              'session': userSession,
              'errores': errores.array(),
              'listadoDiscos': productos });
            })
      }

    },       //Cierre de metodo

    //DASHBOARD
    dashboard: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  

      //Traemos algunos productos 
      res.render(path.join(__dirname, '../views/products/dashboard'), {
              'session': userSession.nombre,
              'listadoDiscos': listadoDiscos });
    },

    //ALTA DE PRODUCTO
    altaProducto: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      
      if ( userSession && userSession.nombre == 'Admin') {

        /*res.render(path.join(__dirname, '../views/products/altaProducto'), {
          'session': userSession.nombre,
          'artistas': controller.artistas,
          'generos': controller.generos }); 
          */
        
        //levantamos los generos y los artistas para el alta de producto.
        db.Genero.findAll({
          raw : true, 
          nest: true,
        }).then(generos => {
        
          db.Artista.findAll({
          raw : true, 
          nest: true,
          }).then(artistas => {
              res.render(path.join(__dirname, '../views/products/altaProducto'), {
              'session': userSession.nombre,
              'artistas': artistas,
              'generos': generos });  
            })
        });
      } else {
        res.send('Página no encontrada');
      }    
    },
    
    //ALTA DE PRODUCTO POST
    altaProductoPost: async (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      //Vamos a dar de alta un usuario. 
      //Creamos primero el objeto con los valores del formulario.
      const {
        nombreArtista,
        nombreDisco,
        categoria,
        precio,
        oferta,
        stock,
        sku,
        recomendado,
    } = req.body;

    const imagen = req.file.filename //Uso el objeto file que viene en el Form de MULTER.

     //Traemos las validaciones del Formulario de Alta de Producto
     const errores = validationResult(req);

     //Con esta variable manejo el error y mensajes al front (0 OK, 1 Error Validacion, 2 Error Create)
     //msje y msjType son para manejar desde el front los errores.
     let errorCode = 0; 
     let msje = '';
     let msjType = '';

      if (errores.isEmpty()) { //Todo bien en el formulario, procedemos a crear el articulo.

          //ahora validamos que el producto (SKU) no exista.
          try {
            
            const productoSku = await db.Producto.findOrCreate({ 
              where: { sku: sku }, 
              defaults: {
                  nombre_disco: nombreDisco, 
                  genero_id: categoria, 
                  stock: stock, 
                  sku: sku, 
                  recomendado: recomendado, 
                  artista_id: nombreArtista, 
                  img: imagen, 
                  precio: precio,
                  oferta: oferta },
              raw : true, 
              nest: true
            });  
            
            if (productoSku[1]) {           //True --> entonces se creo correctamente
              
              msje = 'Producto Creado Satisfactoriamente';
              msjType = 'S';
              errorCode = 0;
            
            } else {  //El próducto ya Existe
                
                const msje = 'El producto ya existe';
                const msjeType = 'E';
                errorCode = 2;

            }

          } catch (error) {

              console.log('entro en esta');
              console.log(error);
                
              msje = 'Error en la creación del Producto. Volver a intentar más tarde';
              msjType = 'E';
              errorCode = 3;
    
          };


      }else{

          // Acá sí hubo errores en alguno de los campos de los formularios.
          // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
          // que ya traía, para que queden visualizados.
          //Seteamos codigo de error igual a 1
          msje = 'Error Validacion';
          errorCode = 1;

      }

    //andes de renderizar la pagina, leemos los datos de los Productos de vuelta de la Base de Datos.

      db.Genero.findAll({
        raw : true, 
        nest: true,
      }).then(generosAll => {
        
        generos = generosAll;
        db.Artista.findAll({
        raw : true, 
        nest: true,
        }).then(artistasAll => {
            artistas = artistasAll 
            
          //Finalmente renderizamos la página con todos los parámetros.
          res.render(path.join(__dirname, '../views/products/altaProducto'), {
            'session': userSession,
            'msje': msje, 
            'type': msjType,
            'errorCode': errorCode,
            'errores': errores.array(),
            'prev': req.body,
            'artistas': artistas,
            'generos': generos });  
          })
      });

    },

    altaProductoPost1: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      //Vamos a dar de alta un usuario. 
      //Creamos primero el objeto con los valores del formulario.

      const {
        nombreArtista,
        nombreDisco,
        categoria,
        precio,
        stock,
        sku,
        recomendado,
        imagen
    } = req.body;
    
     //Traemos las validaciones del Formulario de Alta de Producto
     const errores = validationResult(req);

     if (errores.isEmpty()) { //Todo bien en el formulario, procedemos a crear el articulo.

        //ahora validamos que el producto (SKU) no exista.
        const productoSku = modelProducts.findByField('sku', sku);       

        if (productoSku) {
            //Producto Encontrado. Ya está dado de alta
            const msjeError = 'El producto ya existe';
                res.render(path.join(__dirname, '../views/products/altaProducto'), {
                    'session': userSession,
                    'msje': msjeError, 
                    'errores': errores.array(),
                    'prev': req.body,
                    'artistas': artistas,
                    'generos': generos
                   });
        }else {
            //creamos el objeto con los valores que paso del Body y 
            const obj = {
              ...req.body,
            };
            //Llamamos al metodo de Model que da de alta el usuario
            modelProducts.create(obj);
            const msjeExito = 'Producto Creado Satisfactoriamente';
            res.render(path.join(__dirname, '../views/products/altaProducto'), 
              {'msje': msjeExito,
              'artistas': artistas,
              'generos': generos
              });
        }

     }else{
        // Acá sí hubo errores en alguno de los campos de los formularios.
        // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
        // que ya traía, para que queden visualizados.
        res.render(path.join(__dirname, '../views/products/altaProducto'),{
          'errores':errores.array(),
          'prev': req.body,
          'artistas': artistas,
          'generos': generos
        })

     }
      //res.render(path.join(__dirname, '../views/products/altaProducto'));
    },

    //ALTA GENERO
    altaGenero: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      //console.log(userSession.nombre);
      
      if ( userSession && userSession.nombre == 'Admin') {
        
        //console.log('SORUYO');
        res.render(path.join(__dirname, '../views/products/altaGenero'), {
        'session': userSession.nombre
        });

      } else {

          res.send('Página no encontrada');
      }

    },

    //ALTA GENERO POST
    altaGeneroPost: async (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      //Vamos a dar de alta un artista.
      const nuevoGenero = req.body.titulo;
      //console.log(nuevoGenero);

      //Traemos las validaciones del Formulario de Alta de Artista
      const errores = validationResult(req);

      if (errores.isEmpty()) { //Todo bien en el formulario, procedemos a crear el articulo.
      
        //console.log('todo bien gorila');

        try {
          
          const existeGenero = await db.Genero.findOrCreate({ 
            where: { titulo: nuevoGenero }, 
            defaults: {
                titulo: nuevoGenero},
            raw : true, 
            nest: true
          }); 

          if (existeGenero[1]) {           //True --> entonces se creo correctamente
            const msjeExito = 'Genero Creado Satisfactoriamente';
            const msjeType = 'S';
          
            res.render(path.join(__dirname, '../views/products/altaGenero'), {
              'session': userSession,
              'msje': msjeExito,
              'type': msjeType, 
              'errores': errores.array(),
              'prev': req.body,
              });
          
          } else {

            const msjeError = 'Genero ya existe';
            const msjeType = 'E';
          
            res.render(path.join(__dirname, '../views/products/altaGenero'), {
              'session': userSession,
              'msje': msjeError, 
              'type': msjeType,
              'errores': errores.array(),
              'prev': req.body,
              });
            
          }

        } catch (error) {
          
          const msjeError = 'Error en la creación del Género. Volver a intentar más tarde';
          const msjeType = 'E';

          res.render(path.join(__dirname, '../views/products/altaGenero'), {
            'session': userSession,
            'msje': msjeError, 
            'type': msjeType,
            'errores': errores.array(),
            'prev': req.body });  

        }

      } else {
          // Acá sí hubo errores en alguno de los campos del formulario.
          // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
          // que ya traía, para que queden visualizados.
          res.render(path.join(__dirname, '../views/products/altaGenero'),{
            'errores':errores.array(),
            'prev': req.body
            }); 
      }

    },

    //ALTA ARTISTA
    altaArtista: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;  
      
      if ( userSession && userSession.nombre == 'Admin') {
          
        res.render(path.join(__dirname, '../views/products/altaArtista'), {
        'session': userSession.nombre
        });

      } else {
        res.send('Página no encontrada');
      }

    },

    //ALTA ARTISTA POST
    altaArtistaPost: async (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      //Vamos a dar de alta un artista.
      const nuevoArtista = req.body.nombreArtista;
      
      //Traemos las validaciones del Formulario de Alta de Artista
      const errores = validationResult(req);
     
      if (errores.isEmpty()) { //Todo bien en el formulario, procedemos a crear el articulo.

        try {
          
          const existeArtista = await db.Artista.findOrCreate({ 
            where: { nombre_artista: nuevoArtista }, 
            defaults: {
                nombre_artista: nuevoArtista},
            raw : true, 
            nest: true
          }); 

          if (existeArtista[1]) {           //True --> entonces se creo correctamente
            const msjeExito = 'Artista Creado Satisfactoriamente';
            const msjeType = 'S';
          
            res.render(path.join(__dirname, '../views/products/altaArtista'), {
              'session': userSession,
              'msje': msjeExito,
              'type': msjeType, 
              'errores': errores.array(),
              'prev': req.body,
               });
          
          } else {

            const msjeError = 'Artista ya existe';
            const msjeType = 'E';
          
            res.render(path.join(__dirname, '../views/products/altaArtista'), {
              'session': userSession,
              'msje': msjeError, 
              'type': msjeType,
              'errores': errores.array(),
              'prev': req.body,
               });
            
          }

        } catch (error) {
          
          const msjeError = 'Error en la creación del Artista. Volver a intentar más tarde';
          const msjeType = 'E';

          res.render(path.join(__dirname, '../views/products/altaArtista'), {
            'session': userSession,
            'msje': msjeError, 
            'type': msjeType,
            'errores': errores.array(),
            'prev': req.body });  

        }


      } else {
          // Acá sí hubo errores en alguno de los campos del formulario.
          // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
          // que ya traía, para que queden visualizados.
          res.render(path.join(__dirname, '../views/products/altaArtista'),{
            'errores':errores.array(),
            'prev': req.body
            }); 
      }

    },

    //DETALLE DE PRODUCTO
    productoDetalle: async (req, res) => {

       //Preguntamos por la sesion.
       userSession = req.session.nombre;

       let productoEncontrado = {};

       //Buscamos el producto por Id. en la Base de Datos
       try {
        const { id } = req.params;
        productoEncontrado = await db.Producto.findByPk(id, { 
          raw : true, 
          nest: true,
          include: [{
            association: 'artista',
          }, 
          {
            association: 'genero',
          }]});

      } catch (error) {
        productoEncontrado = undefined;

      }

      res.render(path.join(__dirname, '../views/products/productoDetalle'), {
        'session': userSession,
        'productoEncontrado': productoEncontrado });

    },

    //BUSQUEDA AVANZADA
    busquedaAvanzada: (req, res) => {
      //Preguntamos por la sesion.
      userSession = req.session.nombre;  
      
      if (req.query.keyword) {

        db.Producto.findAll({
          raw : true, 
          nest: true,
          
          include: [{
              association: 'artista',
              where: { 
                nombre_artista: { [Op.like]: req.query.keyword + '%' }
              },
            }, 
            {
              association: 'genero',
            }]
        })
          .then(productos => {
            
            //console.log(productos);
            res.render(path.join(__dirname, '../views/products/busquedaAvanzada'), {
              'session': userSession,
              'alfabeto': alfabeto,
              'listadoDiscos': productos });
          });

      } else {

        res.render(path.join(__dirname, '../views/products/busquedaAvanzada'), {
                'session': userSession,
                'alfabeto': alfabeto,
                'listadoDiscos': listadoDiscos });
        }
    },

    //OFERTAS
    ofertas: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;  

      db.Producto.findAll({
        raw : true, 
        nest: true,
        where: { 
            oferta: { [Op.gt]: 0 }
          },
        include: [{
            association: 'artista',
          }, 
          {
            association: 'genero',
          }]
      })
        .then(productos => {
          
          //console.log(productos);

          res.render(path.join(__dirname, '../views/ofertas'), {
            'session': userSession,
            'alfabeto': alfabeto,
            'listadoDiscos': productos });
        });

    },

    //LISTADO ARTISTAS
    listadoArtistas: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;

      if ( userSession && userSession.nombre == 'Admin') {
        
        db.Artista.findAll({
          raw : true, 
          nest: true,
          })
          .then(artistas => {
            res.render(path.join(__dirname, '../views/products/listadoArtistas'), {
              'session': userSession.nombre,
              'listadoArtistas': artistas });
          })

    } else {
        res.send('Página Artistas no encontrada');
     }

    },

    //LISTADO GENEROS
    listadoGeneros: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session;

      if ( userSession && userSession.nombre == 'Admin') {
        
        db.Genero.findAll({
          raw : true, 
          nest: true,
          })
          .then(generos => {
            res.render(path.join(__dirname, '../views/products/listadoGeneros'), {
              'session': userSession.nombre,
              'listadoGeneros': generos });
        })

      }  else {
        res.send('Página Géneros no encontrada');
     }
    },

    //Agregamos un item al carrito
    agregarACarrito: async (req, res) => {  

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      //Asignamos un array local para trabajar con el carrito a partir del carrito de sesion
      let carritoAux = req.session.carrito;

      //Por destructuring tomamos la cantidad si viene desde productoDetalle
      const { cantidad } = req.body;

      //Primero buscamos el elemento en el Arreglo para o sumarlo o restarlo.
      let disco = carritoAux.find(e => e.id == req.params.id);
      console.log(carritoAux);
      if (disco) {
        
        if (cantidad) {
          disco.cantidad += parseInt(cantidad);     //--> Viene del formulario de productoDetalle.
          
        } else {
          disco.cantidad += 1;
        }
        console.log(disco);
        if (disco.oferta > 0) {
          disco.subtotal = (disco.cantidad * disco.precio) * (1 - disco.oferta/100)
        } else {
          disco.subtotal = disco.cantidad * disco.precio;
        }

          req.session.carrito = carritoAux;

      } else {
            
        //Buscamos el producto por Id. en la Base de Datos
        try {
          const { id } = req.params;
          productoEncontrado = await db.Producto.findByPk(id, { 
            raw : true, 
            nest: true,
            include: [{
              association: 'artista',
            }, 
            {
              association: 'genero',
            }]});

          } catch (error) {
            productoEncontrado = undefined;

        }

        if (productoEncontrado) {

            //console.log('producto encontrado');
          
            if (cantidad) {
              productoEncontrado.cantidad = parseInt(cantidad);  
              
            } else { 
              productoEncontrado.cantidad = 1;
              
            }

              if (productoEncontrado.oferta > 0) {
                  productoEncontrado.subtotal = (productoEncontrado.cantidad * productoEncontrado.precio) * (1 - (productoEncontrado.oferta/100)) ;
              } else {
                  productoEncontrado.subtotal = (productoEncontrado.cantidad * productoEncontrado.precio);
              }
            
            req.session.carrito.push(productoEncontrado);          
          
          } else {
              req.session.carrito = [];
        }

      }

      res.render(path.join(__dirname, '../views/carrito'), {
        'session': userSession,
        'carrito': req.session.carrito 
      });
      
    },

    //Removemos Item de un carrito
    removeItemCarrito: (req, res) => {
      
      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      let carritoAux = req.session.carrito;

      const index = carritoAux.findIndex( (e) => e.id == req.params.id);
      
      if (index >= 0) {     //Entonces lo removemos, sino no hacemos nada.
        
        carritoAux.splice(index, 1);

        res.render(path.join(__dirname, '../views/carrito'), {
          'session': userSession,
          'carrito': req.session.carrito 
        });

      } 
    },

    //SEARCH BAR DEL HEADER
    searchResults: (req, res) => {

      //Preguntamos por la sesion.
      userSession = req.session.nombre;

      const { busquedaHome } = req.body;
      let productos = [];

      //Buscamos Primero por Nombre de Disco, y ademas por nombre de Artista.
      if (busquedaHome) {

        //Busqueda x Nombre de Disco
        db.Producto.findAll({
          raw : true, 
          nest: true,
          where: { 
            nombre_disco: { [Op.like]: '%' + busquedaHome + '%' }
          },
          include: [{
            association: 'artista',
          }, 
          {
            association: 'genero',
          }]
        })
          .then(productosXDisco => {
            //Primero Buscamos x nombre de Disco y lo asignamos a Prodcuto.
            productos = productosXDisco;

          //Busqueda x Nombre Artista
          db.Producto.findAll({
            raw : true, 
            nest: true,
            
            include: [{
                association: 'artista',
                where: { 
                  nombre_artista: { [Op.like]: '%' + busquedaHome + '%' }
                },
              }, 
              {
                association: 'genero',
              }]
          })
            .then(productosXArtista => {
              
              //Si productos ya tenia contenido de Nombre por Disco le agregamos lo encontrado por 
              //Discos x Artista
              if (productos.length > 0) {
                productos = productos.concat(productosXArtista);
              } else {
                productos = productosXArtista;
              }

              res.render(path.join(__dirname, '../views/products/searchResults'), {
                'session': userSession,
                'listadoDiscos': productos });
            });

          })

      } else {
          
          res.render(path.join(__dirname, '../views/products/searchResults'), {
          'session': userSession,
          'listadoDiscos': productos });
      }
      
    }

  } //Fin del Objeto del Controlador

// Finalizamos devolviendo el objeto
module.exports = controller;