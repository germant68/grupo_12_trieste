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

//definimos el objeto Controller
const controller = {

    //HOME
    home: (req, res) => {
        //Traemos algunos productos 
        res.render(path.join(__dirname, '../views/home'), {'listadoDiscos': listadoDiscos});
    },

    //LOGIN
    login: (req, res) => {
        res.render(path.join(__dirname, '../views/users/login.ejs'));
    },
        
    loginPost: (req, res) => {
        //Creamos primero el objeto con los valores del formulario.
        //uso usuario_reg y pwd_reg para igualar a los campos del archivo
        //y que funcione el findByField
        const usuario_reg = req.body.usuario_log;
        const pwd_reg = req.body.password_log;
    
        //Traemos las validaciones del Formulario de Registro
        const errores = validationResult(req);

        if (errores.isEmpty) {
            //ahora validamos que el usuario exista.
            const userLogin = modelUser.findByField('usuario_reg', usuario_reg);

            if (userLogin) {
                //debemos chequear la contraseña
                const pwd = bcryptjs.compareSync(pwd_reg,userLogin.pwd_reg);
                
                if (pwd) {
                    // creamos la sesion
                    req.session.userLogged = userLogin;
                    return res.send("Bienvenido" + userLogin.usuario_reg);
                }else{
                    return res.send("Contraseña incorrecta");

                }

            }else{
                res.send("ERROR! No se encontro el usuario");
            };

        } else {
            res.render('login',{
                'errores':errors.array(),
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
        res.render(path.join(__dirname, '../views/carrito'));
    },

    //FAQ
    faq: (req, res) => {
        res.render(path.join(__dirname, '../views/faq'));
    },

    //CONTACTO
    contacto: (req, res) => {
        res.render(path.join(__dirname, '../views/contacto'));
    },

    //ALTA DE USUARIO - REGISTRO
    postRegistro: (req, res) => {
        
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
    
    }

};

// Finalizamos devolviendo el objeto
module.exports = controller;