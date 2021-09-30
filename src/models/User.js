module.exports = (sequalize, type)=>{
    return sequalize.define('Usuario',{
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull : false
        },
        username: {
            type: type.STRING,
            allowNull : false
        },
        name: {
            type: type.STRING,
            allowNull : false
        },
        password: {
            type: type.STRING,
            allowNull : false
        }
    });
}
