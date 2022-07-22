const express = require('express');
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');

//Seteamos el Sistema de Ruteo
const routerMain = require('./routes/main');

const app = express();

app.set('view engine','ejs');                   //Seteamos el View Engine

//Generamos el Path Public para los archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));

//Uso de Morgan y JSON
app.use(morgan('dev'));
app.use(express.json());

//URL Encoded para parametros y Session
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret: "Secreto",
    resave: false,
    saveUninitialized: false
}))

// app.use('/productos', routerProductos);
app.use(routerMain);

app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});

