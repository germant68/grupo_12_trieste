//Traemos la BD con Sequelize
const db = require('../../Database/models');

// El mainController.js es un objeto literal que va a contener 
// los metodos que van a devolver las paginas solicitadas

//Seteamos la variable path para contener el path a la pagina
const path = require('path');

const fs = require('fs');

// Guardamos el resultado de las validaciones para devolverlas en 
// el Front y una variable global para el mensaje de error del contenido del form
const {validationResult} = require('express-validator');

// Declaro la variable para la encriptacion
const bcryptjs = require('bcryptjs');

//Requerimos el Model User
const modelUser = require('../model/modelUser');

const jsonPath = path.join(__dirname,'../../database/InfoDiscos.json');

// Abro y leo el archivo de Discos.
const json = JSON.parse(fs.readFileSync(jsonPath,'utf-8'));

let listadoDiscos = json.map(e => {
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

//definimos el objeto Controller
const controller = {

    //HOME
    home: (req, res) => {

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
          
          res.render(path.join(__dirname, '../views/home'), {
            'session': userSession,
            'listadoDiscos': productos });
        })
    },

    //HOME
    home1: (req, res) => {
        //Preguntamos por la sesion.
        userSession = req.session.nombre;  
        console.log(req.session);
        
        //Traemos algunos productos 
            res.render(path.join(__dirname, '../views/home'), {
                'session': userSession,
                'listadoDiscos': listadoDiscos });
    },

    //LOGIN
    login: (req, res) => {
        res.render(path.join(__dirname, '../views/users/login.ejs'));
    },

    //LOGOUT
    logout: (req, res) => {
        req.session.destroy();
        //console.log(req.session);
        res.redirect('/');             
    },
        
    loginPost: async (req, res) => {
        //Creamos primero el objeto con los valores del formulario.
        //uso usuario_reg y pwd_reg para igualar a los campos del archivo
        //y que funcione el findByField
        const usuario_email = req.body.usuario_email;
        const pwd_reg = req.body.password_log;

        //console.log(pwd_reg);
    
        //Traemos las validaciones del Formulario de Registro
        const errores = validationResult(req);
                
        if (errores.isEmpty) {
            //ahora validamos que el usuario exista.
            try {
                const userLogin = await db.Usuario.findOne({
                    where: { email: usuario_email }, 
                    raw: true, 
                    nest: true
                });  
                    
                console.log(userLogin);

                if (userLogin) {
                    //debemos chequear la contraseña
                    const pwd_ok = bcryptjs.compareSync(pwd_reg, userLogin.password);
                    
                    if (pwd_ok) {
                        // creamos la sesion
                        req.session.nombre = userLogin.nombre;
                        userSession = req.session.nombre; 

                        try {
                            listadoDiscos = await db.Producto.findAll({
                                raw : true, 
                                nest: true,
                                include: [{
                                  association: 'artista',
                                }, 
                                {
                                  association: 'genero',
                                }]
                              });                            
                                                           
                            res.render(path.join(__dirname, '../views/home'), {
                                'session': userSession, 
                                'listadoDiscos': listadoDiscos });

                        } catch (error) {
                            
                            return res.render(path.join(__dirname, '../views/users/login'), {
                                errores: {'msg': 'Hubo un problema. Intente mas tarde por favor...'}
                            });
                        }
                    
                    }else{
                        
                        return res.render(path.join(__dirname, '../views/users/login'), {
                            errores: {'msg': 'Credenciales Inválidas'}
                        });
                    }

                }else{
                    return res.render(path.join(__dirname, '../views/users/login'), {
                        errores: {'msg': 'Credenciales Inválidas'}
                    });
                };
            } catch (error) {
                
                return res.render(path.join(__dirname, '../views/users/login'), {
                    errores: {'msg': 'Hubo un problema. Intente mas tarde por favor...'}
                });
            }
        
        } else {
            res.render('login',{
                'errores': errors.array(),
                'prev': req.body
            })
        }
    },

    loginPost1: (req, res) => {
        //Creamos primero el objeto con los valores del formulario.
        //uso usuario_reg y pwd_reg para igualar a los campos del archivo
        //y que funcione el findByField
        const usuario_email = req.body.usuario_email;
        const pwd_reg = req.body.password_log;
    
        //Traemos las validaciones del Formulario de Registro
        const errores = validationResult(req);
                
        if (errores.isEmpty) {
            //ahora validamos que el usuario exista.
            const userLogin = modelUser.findByField('email_reg', usuario_email);
            console.log(userLogin);

            if (userLogin) {
                //debemos chequear la contraseña
                const pwd = bcryptjs.compareSync(pwd_reg, userLogin.pwd_reg);
                
                if (pwd) {
                    // creamos la sesion
                    req.session.userLogged = userLogin;
                    req.session.userId = userLogin.nombre_reg;
                    
                        res.render(path.join(__dirname, '../views/home'), {
                            'session': req.session.userId,
                            'listadoDiscos': listadoDiscos });

                }else{
                    
                    return res.render(path.join(__dirname, '../views/users/login'), {
                        errores: {'msg': 'Credenciales Inválidas'}
                    });
                }

            }else{
                return res.render(path.join(__dirname, '../views/users/login'), {
                    errores: {'msg': 'Credenciales Inválidas'}
                });
            };

        } else {
            res.render('login',{
                'errores': errors.array(),
                'prev': req.body
            })
        }
    },

    //REGISTRO DE USUARIO
    registro: (req, res) => {
        res.render(path.join(__dirname, '../views/users/registro.ejs'));
    },

    //CARRITO
    carrito: (req, res) => {

        //Preguntamos por la sesion.
        userSession = req.session;  

        //Traemos algunos productos 
        res.render(path.join(__dirname, '../views/carrito'), {
                'session': userSession.nombre});
                //'miCarrito': listadoDiscos });

        //res.render(path.join(__dirname, '../views/carrito'));
    },

    //FAQ
    faq: (req, res) => {
        //Preguntamos por la sesion.
        userSession = req.session;  

        res.render(path.join(__dirname, '../views/faq'), {
            'session': userSession.nombre});
    },

    //CONTACTO
    contacto: (req, res) => {

        //Preguntamos por la sesion.
        userSession = req.session.nombre;  

        //Traemos algunos productos 
        res.render(path.join(__dirname, '../views/contacto'), {
                'session': userSession });

        //        res.render(path.join(__dirname, '../views/contacto'));
    },

    //ALTA DE USUARIO - REGISTRO
    postRegistro: async (req, res) => {
        
        //Vamos a dar de alta un usuario. 
        //Creamos primero el objeto con los valores del formulario.
        const{
            nombre_reg,
            apellido_reg,
            //usuario_reg,
            email_reg,
            pwd_reg
        }=req.body;

        //Traemos las validaciones del Formulario de Registro
        const errores = validationResult(req);
    
        if(errores.isEmpty()){
            
            //creamos el objeto con los valores que paso del Body y 
            //hacemos un HASH sobre la contraseña.
            const password = bcryptjs.hashSync(pwd_reg, 10);
            const obj = {
                ...req.body,                
            };

            //ahora validamos que el usuario no exista.
            //Buscamos en la BD
            
            try {
                const userEmail = await db.Usuario.findOrCreate({ 
                    where: { email: email_reg }, 
                    defaults: {nombre: nombre_reg, apellido: apellido_reg, password: password},
                    raw : true, nest: true});  
            
                    if (userEmail[1]) {             //True --> entonces se creo correctamente
                        const msjeExito = 'Usuario Creado Satisfactoriamente';
                        res.render(path.join(__dirname, '../views/users/registro'), {'msje': msjeExito });
                        
                    } else {
                        const msjeError = 'El usuario ya se encuentra registrado';
                        res.render(path.join(__dirname, '../views/users/registro'), {
                        'msje': msjeError, 
                        'errores':errores.array(),
                        'prev': req.body });
                    }

                } catch (error) {
                
                    const msjeError = 'Error en la creación. Volver a intentar más tarde';
                    res.render(path.join(__dirname, '../views/users/registro'), {
                    'msje': msjeError, 
                    'errores':errores.array(),
                    'prev': req.body });
            };

        }else{
            
            // Acá sí hubo errores en alguno de los campos de los formularios.
            // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
            // que ya traía, para que queden visualizados.
            res.render(path.join(__dirname, '../views/users/registro'),{
                'errores':errores.array(),
                'prev': req.body
            })
        }
    
    },

    postRegistro1: (req, res) => {
        
        //Vamos a dar de alta un usuario. 
        //Creamos primero el objeto con los valores del formulario.
        const{
            nombre_reg,
            apellido_reg,
            usuario_reg,
            email_reg,
            pwd_reg
        }=req.body;
    
        //Traemos las validaciones del Formulario de Registro
        const errores = validationResult(req);
    
        if(errores.isEmpty()){
            
            //ahora validamos que el usuario no exista.
            const userId = modelUser.findByField('usuario_reg', usuario_reg);

            if(userId){

                const msjeError = 'El usuario ya se encuentra registrado';
                res.render(path.join(__dirname, '../views/users/registro'), {
                    'msje': msjeError, 
                    'errores':errores.array(),
                    'prev': req.body });
            
            }else{

                //Buscamos el usuario por email. Si Existe no puede darse de alta
                const userLogin = modelUser.findByField('email_reg', email_reg);

                if(userLogin) {
                    
                    const msjeError = 'El mail ya se encuentra registrado';
                    res.render(path.join(__dirname, '../views/users/registro'), {
                        'msje': msjeError, 
                        'errores':errores.array(),
                        'prev': req.body });
                }else{

                    //creamos el objeto con los valores que paso del Body y 
                    //hacemos un HASH sobre la contraseña.
                    const obj = {
                        ...req.body,
                        pwd_reg: bcryptjs.hashSync(pwd_reg, 10),
                    };
                    
                    //Llamamos al metodo de Model que da de alta el usuario
                    modelUser.create(obj);
                    const msjeExito = 'Usuario Creado Satisfactoriamente';
                    res.render(path.join(__dirname, '../views/users/registro'), {'msje': msjeExito });
                }
            }
            
        }else{
            
            // Acá sí hubo errores en alguno de los campos de los formularios.
            // Renderizamos el formulario con el arreglo de errores para que los muestre y los valores
            // que ya traía, para que queden visualizados.
            res.render(path.join(__dirname, '../views/users/registro'),{
                'errores':errores.array(),
                'prev': req.body
            })
        }
    
    },

    //USUARIOS SEQUELIZE
    listadoUsuarios: (req, res) => {
           db.Usuario.findAll({  raw : true, nest: true })
            .then((users) => {
                console.log(users);
                return res.render(path.join(__dirname, '../views/users/listadoUsuarios'), {users});
            })
    }

};

// Finalizamos devolviendo el objeto
module.exports = controller;