module.exports = (sequalize, type)=>{
    return sequalize.define('Sigue',{
        id_Seguidor: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull : false
        },
        Seguido: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: false,
            allowNull : false
        }
    });
}