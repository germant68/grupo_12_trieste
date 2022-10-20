//Traemos la base de datos con Sequelize
const e = require('express');
const db = require('../models');   //../../Database/models

const Op = db.Sequelize.Op; // Para operadores del WHERE.

//definimos el objeto Controller
const apiController = {

    //LISTADO DE USUARIOS
    usuarios: (req, res) => {

        db.Usuario.findAll({
            raw : true, 
            nest: true
            
        })
        .then(usuarios => {
            return  res.status(200).json({
                count: usuarios.length,
                status: 200,
                data: usuarios.map(e => {
                    return { 
                        id: e.id,
                        name: e.nombre,
                        apellido: e.apellido,
                        email: e.email,
                        detail: 'http://localhost:3001/api/usuario/' + e.id,
                        newsletter: e.newsletter,
                    }
                })
            })
        })
            
    },

    detalleUsuario: async (req, res) => {

        const { id } = req.params;         
        
        let infoUser = {};
        
        try {
            infoUser = await db.Usuario.findByPk(id, { 
                raw : true, 
                nest: true
            })
                
            const usuario = {
                id: infoUser.id,
                name: infoUser.nombre,
                username: infoUser.apellido,
                email: infoUser.email,
                newsletter: infoUser.newsletter,
            };

            if(usuario.name){
                res.status(200).json(usuario);
            }else{
                res.sendStatus(400);
            }   

        } catch (error) {
            res.sendStatus(400);
        }
    }
}
        

// Finalizamos devolviendo el objeto
module.exports = apiController;

