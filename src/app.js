const express = require('express');
const path = require('path');

//Seteamos el Sistema de Ruteo
const routerMain = require('./routes/main');

const app = express();

app.set('view engine','ejs');                   //Seteamos el View Engine

//Generamos el Path Public para los archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));


app.listen(3001, () => {
    console.log("Servidor escuchando en el puerto 3001");
});

// app.use('/productos', routerProductos);
app.use(routerMain);


