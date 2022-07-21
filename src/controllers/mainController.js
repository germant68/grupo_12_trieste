// El mainController.js es un objeto literal que va a contener 
// los metodos que van a devolver las paginas solicitadas

//Seteamos la variable path para contener el path a la pagina
const path = require('path');

const fs = require('fs');

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

    

};

// Finalizamos devolviendo el objeto
module.exports = controller;