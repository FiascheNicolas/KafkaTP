module.exports = (sequalize, type)=>{
    return sequalize.define('Post',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        titulo: {
            type: type.STRING,
            allowNull : false
        },
        imagen: {
            type: type.STRING,
            allowNull : false
        },
        texto: {
            type: type.STRING,
            allowNull : false
        },
        cantidadLikes: {
            type: type.INTEGER,
            allowNull: false,
            defaultValue: 0, 
        },
        idUser: {
            type: type.INTEGER,
            allowNull : false
        }
    });
}
