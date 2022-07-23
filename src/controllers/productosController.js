const fs = require('fs');

const path = require('path');

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
  }) 

//definimos el objeto Controller
const controller = {
    productos: (req, res) => {

        res.render(path.join(__dirname, '../views/products/productos'), {'listadoDiscos': listadoDiscos});
    },

    altaProducto: (req, res) => {

      res.render(path.join(__dirname, '../views/products/altaProducto'));
    },

    productoDetalle: (req, res) => {
      res.render(path.join(__dirname, '../views/products/productoDetalle'));
    }
}

// Finalizamos devolviendo el objeto
module.exports = controller;