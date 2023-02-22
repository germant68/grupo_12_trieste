const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const methodOverride = require('method-override');
const dotenv = require("dotenv").config();

//const bodyParser = require('body-parser');
//const busboyBodyParser = require('busboy-body-parser');
const cors = require('cors');

//Seteamos el Sistema de Ruteo
const routerMain = require('./routes/main');

const app = express();    //Indicamos a la Aplicacion que puede usar los metodos de Express

// Enable the express server to respond to preflight requests
app.use(cors());

//Seteamos el View Engine
app.set('view engine','ejs');                   

//Generamos el Path Public para los archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));

//Uso de Morgan 
app.use(morgan('dev'));

//Uso de Method Override Para Simular el POST
app.use(methodOverride('_method'));

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

// Set the Cookie parser
app.use(cookieParser());

//Variable que contiene el path de las rutas
app.use(routerMain);


//Servidor escuchando
app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});

