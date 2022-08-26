module.exports = (sequelize, dataTypes) => {

    //Alias
    let alias = 'Producto';

    //Columnas
    let cols = {
        id: { type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true },

        nombre_disco: {
            type: dataTypes.STRING,
        },

        genero_id: {type: dataTypes.INTEGER},

        stock: {type: dataTypes.INTEGER},

        sku: {type: dataTypes.STRING},

        recomendado: {type: dataTypes.BOOLEAN},

        artista_id: {type: dataTypes.INTEGER},

        img: {type: dataTypes.STRING},

        precio: {type: dataTypes.DECIMAL(10,2)}

    };

    //Config
    let config = {
        tableName: 'producto',
        timestamps: false
    };
    
    const Producto = sequelize.define(alias, cols, config);

    //Asociaciones
    Producto.associate = (models) => {
        Producto.belongsTo(models.Artista, {
            as: 'artista',
            foreignKey: 'artista_id'
        });
   

        Producto.belongsTo(models.Genero, {
            as: 'genero',
            foreignKey: 'genero_id'
        });
    };

return Producto;

}