const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

//Seteamos el Sistema de Ruteo
const routerMain = require('./routes/main');
const userMdw = require('./middlewares/userMdw');

const app = express();

app.set('view engine','ejs');                   //Seteamos el View Engine

//Generamos el Path Public para los archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));

//Uso de Morgan 
app.use(morgan('dev'));

// Parsing the incoming data 
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//URL Encoded para parametros y Session. Seteamos la sesion para un día
const oneDay = 1000 * 60 * 60 * 24;

app.use(session({
    secret: "Secreto",
    resave: false,
    saveUninitialized: false
}));

app.use(userMdw);

var userSession;

// Set the Cookie parser
app.use(cookieParser());

// app.use('/productos', routerProductos);
app.use(routerMain);

app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});

