// El mainController.js es un objeto literal que va a contener 
// los metodos que van a devolver las paginas solicitadas

//Seteamos la variable path para contener el path a la pagina
const path = require('path');

const fs = require('fs');

// Guardamos el resultado de las validaciones para devolverlas en 
// el Front
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

    //REGISTRO DE USUARIO
    registro: (req, res) => {
        res.render(path.join(__dirname, '../views/users/registro.ejs'));
    },

    //OFERTAS
    ofertas: (req, res) => {
        res.render(path.join(__dirname, '../views/ofertas'));
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
    
        //Traemos las validaciones del 
        const errores = validationResult(req);
    
        if(errores.isEmpty()){
            
            //Buscamos el usuario por email. Si Existe no puede darse de alta
            const userLogin = modelUser.findByField('email_reg', email_reg);

            if(userLogin){

                const msjeError = 'El susuario ya se encuentra registrado';
                res.render(path.join(__dirname, '../views/users/registro'), {'msje': msjeError });
            
            }else{
                
                //creamos el objeto con los valores que paso del Body y 
                //hacemos un HASH sobre la contraseña.
                const obj = {
                    ...req.body,
                    pwd_reg: bcryptjs.hashSync(pwd_reg, 10),
                };
                //res.send(obj);
                //Llamamos al metodo de Model que da de alta el usuario
                modelUser.create(obj);
                const msjeExito = 'Usuario Creado Satisfactoriamente';
                res.render(path.join(__dirname, '../views/users/registro'), {'msje': msjeExito });
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