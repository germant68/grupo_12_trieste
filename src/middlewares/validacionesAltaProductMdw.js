const path = require('path');

// Trabajamos con el Express-Validator para las validaciones. Tomamos los valores
// del BODY
const { body } = require('express-validator');

//Implementamos las validaciones. Todas en un arreglo.
// Lo pasamos como MDW en el POST del Registro
module.exports =  validateAltaProducto = [
    body('nombreArtista').notEmpty().withMessage('Debe ingresar el nombre del Artista'),
    body('nombreDisco').notEmpty().withMessage('Debe ingresar el nombre del Disco'),
    body('precio').notEmpty().withMessage('Debe ingresar el precio del producto'),
    body('precio').isNumeric().withMessage('El precio debe ser numérico'),
    body('stock').isNumeric().withMessage('El stock debe ser numérico'),
    body('imgagen').custom((value, { req }) => {
       let file = req.file;
       let acceptedExtensions = ['.jpg', '.png', '.gif'];

        if (!file) {
            throw new Error('Debes subir una imagen');
        } else {
            let fileExtension = path.extname(file.originalname);
            if (acceptedExtensions.includes(fileExtension)) {
                throw new Error (`Las extensiones aceptadas son ${acceptedExtensions.join(', ')}`);
            }
        }

        return true;
    })

];


