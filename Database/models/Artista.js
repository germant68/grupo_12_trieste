module.exports = (sequelize, dataTypes) => {
    
    //Alias
    let alias = 'Artista';

    //Columnas
    let cols = {
        id: { type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true },

        nombre_artista: { 
            type: dataTypes.STRING,
            
        },
    };
    
    //Config
    let config = {
        tableName: 'artista',
        timestamps: false
    };
    
    let  Artista = sequelize.define(alias, cols, config);

    Artista.associate = (models) => {
        Artista.hasMany(models.Producto, {
            as: 'producto',
            foreignKey: 'artista_id'
        });
    }
    return Artista;
}