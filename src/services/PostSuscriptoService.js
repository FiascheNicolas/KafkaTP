const {PostSuscriptoModel} = require('../connection ');

class PostSuscriptoService {

    static async add(followPostId , idUser){
        const newSuscriptionPost = {
            "followPostId" : followPostId,
            "idUser" : idUser,
        }
        return await PostSuscriptoModel.create(newSuscriptionPost); 
    }

    static async getAll(){
        var postSuscriptos = await PostSuscriptoModel.findAll({
            raw: true,
            nest: true
         });
        return  {postSuscriptos: postSuscriptos};    
    }

}

module.exports = {
    PostSuscriptoService
}
