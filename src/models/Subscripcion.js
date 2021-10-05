module.exports = (sequalize, type)=>{
    return sequalize.define('Subscripcion',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        followName:{
            type: type.STRING,
            allowNull : false
        },
        idUser: {
            type: type.INTEGER,
            allowNull : false
        }
    });
}
