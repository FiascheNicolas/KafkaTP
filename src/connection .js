const {Sequelize} = require('sequelize');

const userModel = require('./models/User');
const postModel = require('./models/Post');
const subscripcionModel = require('./models/Subscripcion');
const likeModel = require('./models/Like');


const sequelize = new Sequelize("faceunla", "root", "root" ,{
    host : "localhost",
    port: "3306",
    dialect: "mysql"
});

const UserModel = userModel(sequelize, Sequelize);
const PostModel = postModel(sequelize, Sequelize);
const SubscripcionModel = subscripcionModel(sequelize, Sequelize);
const LikeModel = likeModel(sequelize, Sequelize);

UserModel.hasMany(PostModel, {
        foreignKey: 'idUser' , 
        as: 'posts'
    });
PostModel.belongsTo(UserModel, {
    foreignKey: 'idUser',
    as: 'user'
});

UserModel.hasMany(SubscripcionModel, {
    foreignKey: 'idUser' , 
    as: 'suscripciones'
});
SubscripcionModel.belongsTo(UserModel, {
    foreignKey: 'idUser',
    as: 'user'
});

UserModel.hasMany(LikeModel, {
    foreignKey: 'idUser' , 
    as: 'likes'
});
LikeModel.belongsTo(UserModel, {
    foreignKey: 'idUser',
    as: 'user'
});

/** INICIALIZO EL MAPEO **/
sequelize.sync({ force: false})
    .then( ()=>{});

module.exports = {
    UserModel,
    PostModel,
    SubscripcionModel, 
    LikeModel,
    sequelize
}