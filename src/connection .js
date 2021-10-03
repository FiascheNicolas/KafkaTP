const {Sequelize} = require('sequelize');

const userModel = require('./models/User');
const seguidoModel = require('./models/Sigue');
const postModel = require('./models/Post');
const postSuscriptoModel = require('./models/PostSuscripto');

/** CONFIGURACIÓN CONEXION PARA LA BD */
const sequelize = new Sequelize("kafkaredsocial_db", "root", "root" ,{
    host : "localhost",
    port: "3306",
    dialect: "mysql"
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
/*
const sequelize = new Sequelize("bbvz5ubbkmmsymn7s0pm", "u1k3xrdtrvnoxfts", "229roI7cszThaIgUcPHT" ,{
    host : "bbvz5ubbkmmsymn7s0pm-mysql.services.clever-cloud.com",
    port: "3306",
    dialect: "mysql"
});
*/

/*** REALIZO LOS MAPEOS DE LAS CLASES */
const UserModel = userModel(sequelize, Sequelize);
const SeguidoModel = seguidoModel(sequelize, Sequelize);
const PostModel = postModel(sequelize, Sequelize);
const PostSuscriptoModel = postSuscriptoModel(sequelize, Sequelize);


 /*** relacion one to many de User y Post **/
 UserModel.hasMany(PostModel, {
        foreignKey: 'idUser' ,
        as: 'posts'
 });
    
PostModel.belongsTo(UserModel, {
    foreignKey: 'idUser',
    as: 'user'
});

 /*** relacion one to many de User y PostSuscriptos **/
UserModel.hasMany(PostSuscriptoModel, {
    foreignKey: 'idUser' , 
    as: 'suscripciones'
});

PostSuscriptoModel.belongsTo(UserModel, {
    foreignKey: 'idUser',
    as: 'user'
});

 /*** relacion many to many de User **/
SeguidoModel.belongsTo(UserModel, {
        foreignKey: 'id_Seguidor' ,
        as: 'Seguidor'
 });
    
 SeguidoModel.belongsTo(UserModel, {
        foreignKey: 'Seguido' ,
        as: 'Sigue_a'
 });

/** INICIALIZO EL MAPEO **/
sequelize.sync({ force:false })
    .then( ()=>{
        console.log("Models mapeados!!!");
    });

/** EXPORTO LOS OBJETOS PARA PODER USARLOS PARA LAS CONSULTAS */
module.exports = {
    UserModel,
    PostModel,
    SeguidoModel,
    PostSuscriptoModel, 
    sequelize
}