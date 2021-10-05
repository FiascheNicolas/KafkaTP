const {LikeModel} = require('../connection ');

class LikeService {
    static async add(idPost , idUser){
        const newLike = {
            "idPost" : idPost,
            "idUser" : idUser,
        }
        return await LikeModel.create(newLike); 
    }

    static async getById(post, user){
        var like = await LikeModel.findAll({
            where: { 
                idUser: user,
                idPost: post
            },
            raw: true,
            nest: true
         });
        return  like;    
    }

    static async getAll(id){
        var likedPosts = await LikeModel.findAll({
            where: { 
                idUser: id
            },
            raw: true,
            nest: true
         });
        return  {likedPosts};    
    }

}

module.exports = {
    LikeService
}
