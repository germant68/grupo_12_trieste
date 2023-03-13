module.exports = (sequelize, dataTypes) => {
    
    //Alias
    let alias = 'Genero';

    //Columnas
    let cols = {
        
        id:{
            type: dataTypes.INTEGER,
            autoIncrement : true,
            primaryKey: true

        },

        titulo:{
            type:dataTypes.STRING,

        },
    };
    
    //Config
    let config = {
        tableName: 'generos',
        timestamps: false
    };
    
    let  Genero = sequelize.define(alias, cols, config);

    Genero.associate = (models) => {
        Genero.hasMany(models.Producto, {
            as: 'producto',
            foreignKey: 'genero_id'
        });
    }
    return Genero;
}