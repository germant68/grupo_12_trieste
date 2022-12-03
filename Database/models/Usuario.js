module.exports = (sequelize, dataTypes) => {
    
    //Alias
    let alias = 'Usuario';

    //Columnas
    let cols = {
        
        id: { type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true },

        email: { 
            type: dataTypes.STRING,
            
        },

        nombre: { 
            type: dataTypes.STRING,
            
        }, 

        apellido: { 
            type: dataTypes.STRING,
            
        }, 

        password: { 
            type: dataTypes.STRING,
            
        },

        newsletter: {type: dataTypes.BOOLEAN},

        img: {type: dataTypes.STRING},

        direccion: {type: dataTypes.STRING},

        codpostal: {type: dataTypes.STRING},

        es_admin: {type: dataTypes.STRING},
    };
    
    //Config
    let config = {
        tableName: 'usuario',
        timestamps: false
    };
    
    let  Usuario = sequelize.define(alias, cols, config);

    return Usuario;
}