const Op = require('sequelize').Op;
const {UserModel} = require('../connection ');

class UserService {
/*
    static async add(username,nombre,password){
        const newUser = {
            "username" : username,
            "nombre" : nombre,
            "password" : password
        }

        return await UserModel.create(newUser); 
    }
*/

    static async add(newUser){
        return await UserModel.create(newUser); 
    }

    static async getAll(){
        var users = await UserModel.findAll({
            raw: true,
            nest: true
         });
        return  {users: users};    
    }

    static async findUsersByUsername(username){
        var userFilters = await UserModel.findAll({
            where: { /** ME TRAE TODOS LOS USUARIOS QUE CUMPLAN EL PARAMETRO INDICADO*/
                username :{
                    [Op.substring]: username      // LIKE '%username%'
                }
            },
            raw: true,
            nest: true 
        });

        return {userFilters : userFilters};
    }
    
    static async getById(id){
        var users = await UserModel.findByPk(id);
        console.log("USER");
        console.log(users);
        return  {users: users};    
    }

    static async getById2(id, done){
        return await UserModel.findById(id, function(err, user){
            done(err, user)
        });    
    }

    static async getByUseryPass(username, password){
        var users = await UserModel.findOne({
            where: {
                [Op.and]: [ {username: username }, { password: password}],
            }
        });
        return  {users: users};    
    }

    static async getByUser(username){
        var user = await UserModel.findAll({
            where : { username: username},
            attributes: ['username']
        });
        return  {user: user};    
    }

}

module.exports = {
    UserService
}
