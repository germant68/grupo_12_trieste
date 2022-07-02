// El mainController.js es un objeto literal que va a contener 
// los metodos que van a devolver las paginas solicitadas

//Seteamos la variable path para contener el path a la pagina
const path = require('path');

//definimos el objeto Controller
const controller = {
    home: (req, res) => {
        res.render(path.join(__dirname, '../views/home'));
        
    },

    login: (req, res) => {
        res.render(path.join(__dirname, '../views/login'));
    },

    registro: (req, res) => {
        res.render(path.join(__dirname, '../views/registro'));
    },

    ofertas: (req, res) => {
        res.render(path.join(__dirname, '../views/ofertas'));
    }
};

// Finalizamos devolviendo el objeto
module.exports = controller;