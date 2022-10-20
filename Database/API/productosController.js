//Traemos la base de datos con Sequelize
const db = require('../models');   //../../Database/models
const path = require('path');
const { url } = require('inspector');

const imgUrl = path.join(__dirname + '../../../public/images/');
console.log(imgUrl);

const Op = db.Sequelize.Op; // Para operadores del WHERE.

//definimos el objeto Controller
const apiController = {

    //LISTADO DE PRODUCTOS
    productos: (req, res) => {

        db.Producto.findAll({
            raw : true, 
            nest: true,
            include: [{
                association: 'artista',
            }, 
            {
                association: 'genero',
            }]
        })
        .then(infoProductos => {

            return  res.status(200).json({
                count: infoProductos.length,
                status: 200,
                products: infoProductos.map(e => {
                    return { 
                        id: e.id,
                        nombre_disco: e.nombre_disco,
                        genero_id: e.genero_id,
                        stock: e.stock,
                        sku: e.sku,
                        recomendado: e.recomendado,
                        artista_id: e.artista_id,
                        img: e.img,
                        precio: e.precio,
                        oferta: e.oferta,
                        artista: e.artista,
                        genero: e.genero,
                        detail: 'http://localhost:3001/api/producto /'+ e.id,

                    }
                })
            })
        })
    },

    detalleProducto: async (req, res) => {
        
        const { id } = req.params;         
        
        let infoProducto = {};

        try {
            infoProducto = await db.Producto.findByPk(id, { 
                raw : true, 
                nest: true,
                include: [{
                    association: 'artista',
                }, 
                {
                    association: 'genero',
                }]
            })
        
            // const producto = {
                        
            //     id: infoProducto.id,
            //     nombre_disco: infoProducto.nombre_disco,
            //     genero_id: infoProducto.genero_id,
            //     stock: infoProducto.stock,
            //     sku: infoProducto.sku,
            //     recomendado: infoProducto.recomendado,
            //     artista_id: infoProducto.artista_id,
            //     img: infoProducto.img, //, 'https://localhost:3001/public/images/' + 
            //     precio: infoProducto.precio,
            //     oferta: infoProducto.oferta,
            //     artista: infoProducto.artista,
            //     genero: infoProducto.genero,
            // }

            if(infoProducto.id){
                res.status(200).json(infoProducto);
            }else{
                res.sendStatus(400);
            }
                
        } catch (error) {
            res.sendStatus(400);
        }

    },

    generos: (req, res) => {
        db.Genero.findAll({
            raw : true, 
            nest: true
            
        })
        .then(infoGeneros => {
            return  res.status(200).json({
                count: infoGeneros.length,
                status: 200,
                data: infoGeneros.map(e => {
                    return { 
                        id: e.id,
                        titulo: e.titulo,

                    }
                })
            })
        })
    },

    ultimoDisco: async (req, res) => {
        
        let infoProducto = {};

        try {
                infoProducto = await db.Producto.findAll({
                            raw : true, 
                            nest: true,
                            limit: 1,
                            order: [ [ 'id', 'DESC' ]],
                            include: [{
                                association: 'artista',
                            }, 
                            {
                                association: 'genero',
                            }]
                })
        
                // const producto = {
                            
                //     id: infoProducto[0].id,
                //     nombre_disco: infoProducto[0].nombre_disco,
                //     genero_id: infoProducto[0].genero_id,
                //     stock: infoProducto[0].stock,
                //     sku: infoProducto[0].sku,
                //     recomendado: infoProducto[0].recomendado,
                //     artista_id: infoProducto[0].artista_id,
                //     img: imgUrl + infoProducto[0].img,
                //     precio: infoProducto[0].precio,
                //     oferta: infoProducto[0].oferta,
                //     artista: infoProducto[0].artista,
                //     genero: infoProducto[0].genero,
                // }

                if(infoProducto[0].id){
                    //res.status(200).json(producto);
                    res.status(200).json({
                        count: '1',
                        status: 200,
                        data: infoProducto })
                }else{
                    res.sendStatus(400);
                }
                
            } catch (error) {
                res.sendStatus(400);
            }
    },

    artistas: (req, res) => {

        db.Artista.findAll({
            raw : true, 
            nest: true
            
        })
        .then(artistas => {
            return  res.status(200).json({
                count: artistas.length,
                status: 200,
                data: artistas.map(e => {
                    return { 
                        id: e.id,
                        nombre_artista: e.nombre_artista,

                    }
                })
            })
        })
    }
        
}

// Finalizamos devolviendo el objeto
module.exports = apiController;

