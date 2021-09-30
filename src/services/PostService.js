const {PostModel} = require('../connection ');

class PostService {

    static async add(newPost){
        return await PostModel.create(newPost); 
    }

    static async getAll(){
        var posts = await PostModel.findAll({
            raw: true,
            nest: true
         });
        return  {posts: posts};
    }

}

module.exports = {
    PostService
}
