//Este Model tiene como funcionalidad implementar los siguientes pasos: CRUD
// 1. Obtener todos los prodductos
// 2. Generar un nuevo Id para un usuario nuevo
// 3. Crear un usuario nuevo
// 4. Buscar por Primary Key un usuario, en este caso ID
// 5. Buscar por un campo determinado.
// 6. Update de un producto.
// 7. Borrar Producto

// Importamos FS y Path para trabajar con el archivo de Usuarios
const e = require('express');
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
    },

    delete: (id) => {
      //Buscamos el producto por Id. Para ello usamos el ModelProducts.
      let productoEncontrado = producto.findByPk(id);

      if (!productoEncontrado) { //Retorna falso
         return productoEncontrado; //false
      };

      //sino retorna encontrado entonces modificamos...filtramos aquel producto que no quiero
      let productosAll = producto.getAllProductos();
    
      let productosRestantes = productosAll.filter(e => e.id != parseInt(id));
      
      fs.writeFileSync(producto.filename, JSON.stringify(productosRestantes, null, ' '));
      return true;
    },

    modifProducto: (pe) => {
        
    }
}

//Devolvemos el objeto usuario
module.exports = producto;