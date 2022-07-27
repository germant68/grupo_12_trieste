// Importamos FS y Path para trabajar con el archivo de Usuarios
const { json } = require('express');
const fs = require('fs');
const path = require('path');

// Creamos el objeto producto que va a ser quien maneje el modelo
const producto = {

    //Obtenemos el nombre del archivo
    filename: path.join(__dirname, '../../Database/InfoDiscos.json'),

    //Traigo todos los productos para obtener el último numero de iD
    getAllProductos: () => {
        return JSON.parse(fs.readFileSync(producto.filename,'utf-8'));
    },

    //genero nuevo Id para el producto nuevo
    newId: () => {
        const allProducts = producto.getAllProductos();
        if (allProducts.length) {
            return (allProducts[allProducts.length - 1].id) + 1;
        } else {
            return 1;
        }
    },

    create:(data) => {
        
        const allProducts = producto.getAllProductos();
        const obj = {
            id: producto.newId(),
            nombreArtista: data.nombreArtista,
            nombreDisco: data.nombreDisco,
            precio: data.precio,
            stock: data.stock,
            sku: data.sku,
            categoria: data.categoria,
            vendidos: 0,
            recomendado: data.recomendado,
            imgagen: data.imgagen
        }

        allProducts.push(obj);

        fs.writeFile(producto.filename,JSON.stringify(allProducts,null,' '),(err) => {
            if(err){
                return false;
            }
        });
        return obj;
    },

    findByPk: (id) => {
        return producto.getAllProductos().find((element) => element.id == id);
    },

    findByField: (field, text) => {
        
        return producto.getAllProductos().find((element) => element[field] == text);
    }
}

//Devolvemos el objeto usuario
module.exports = producto;