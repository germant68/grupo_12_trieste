//Traemos la base de datos con Sequelize
const db = require('../models');   //../../Database/models

const Op = db.Sequelize.Op; // Para operadores del WHERE.

//definimos el objeto Controller
const apiController = {

    //LISTADO DE PRODUCTOS
    productos: (req, res) => {

        //res.send('HOLETIS');
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
                        detail: 'http://localhost:3001/api/producto/' + e.id,

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
        
            const producto = {
                        
                id: infoProducto.id,
                nombre_disco: infoProducto.nombre_disco,
                genero_id: infoProducto.genero_id,
                stock: infoProducto.stock,
                sku: infoProducto.sku,
                recomendado: infoProducto.recomendado,
                artista_id: infoProducto.artista_id,
                img: 'https://localhost:3001/public/images/' + infoProducto.img,
                precio: infoProducto.precio,
                oferta: infoProducto.oferta,
                artista: infoProducto.artista,
                genero: infoProducto.genero,
            }

            if(producto.id){
                res.status(200).json(producto);
            }else{
                res.sendStatus(400);
            }
                
        } catch (error) {
            res.sendStatus(400);
        }

            // const producto = {
            //     id: infoProducto.id,
            //     name: infoProducto.nombre,
            //     username: infoUser.apellido,
            //     email: infoUser.email,
            //     newsletter: infoUser.newsletter,
            // };

            // if(producto.id){
            //     res.status(200).json(producto);
            // }else{
            //     res.sendStatus(400);
            // }   

        

    }
        
}

// Finalizamos devolviendo el objeto
module.exports = apiController;

