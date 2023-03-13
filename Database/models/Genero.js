module.exports = (sequelize, dataTypes)=>{


    const Genero = sequelize.define('Genero',{

        id:{
            type: dataTypes.INTEGER,
            autoIncrement : true,
            primaryKey: true

        },

        titulo:{
            type:dataTypes.STRING,

        }
    },

    {
        tablename : 'generos',
        timestamps : false
    },
    );

    Genero.associate = (models) => {
        Genero.hasMany(models.Producto, {
            as: 'producto',
            foreignKey: 'genero_id'
        });
    }

    return Genero;

}