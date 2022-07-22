// El mainController.js es un objeto literal que va a contener 
// los metodos que van a devolver las paginas solicitadas

//Seteamos la variable path para contener el path a la pagina
const path = require('path');

const fs = require('fs');

const {validationResult} = require('express-validator');

const bcryptjs = require('bcryptjs');

//Requerimos el Model User
const modelUser = require('../model/modelUser');

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


//definimos el objeto Controller
const controller = {
    home: (req, res) => {
        //Traemos algunos productos 
        res.render(path.join(__dirname, '../views/home'), {'listadoDiscos': listadoDiscos});
    },

    login: (req, res) => {
        res.render(path.join(__dirname, '../views/users/login.ejs'));
    },

    registro: (req, res) => {
        res.render(path.join(__dirname, '../views/users/registro.ejs'));
    },

    ofertas: (req, res) => {
        res.render(path.join(__dirname, '../views/ofertas'));
    },

    carrito: (req, res) => {
        res.render(path.join(__dirname, '../views/carrito'));
    },

    faq: (req, res) => {
        res.render(path.join(__dirname, '../views/faq'));
    },

    contacto: (req, res) => {
        res.render(path.join(__dirname, '../views/contacto'));
    },

    postRegistro: (req, res) => {
        //Vamos a dar de alta un usuario. 
        //Creamos primero el objeto con los valores del formulario.
        const {
            nombre_reg,
            apellido_reg,
            usuario_reg,
            email_reg,
            pwd_reg
        }=req.body;
    
        //Validamos que no exista su mail
        const errors = validationResult(req);
    
        if(errors.isEmpty()){
            console.log(email_reg);
            const userLogin = modelUser.findByField('email_reg', email_reg)
            console.log(userLogin);
            if(userLogin){
                const msjeError = 'El susuario ya se encuentra registrado';
                res.render(path.join(__dirname, '../views/users/registro'), {'msje': msjeError });
            }else{
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
            res.render('registro',{
                'errors':errors.array(),
                'prev': req.body
            })
        }
    
    
    }

    

};

// Finalizamos devolviendo el objeto
module.exports = controller;