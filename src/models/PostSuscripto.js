module.exports = (sequalize, type)=>{
    return sequalize.define('PostSuscripto',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        followPostId:{
            type: type.INTEGER,
            allowNull : false
        },
        idUser: {
            type: type.INTEGER,
            allowNull : false
        }
    });
}
