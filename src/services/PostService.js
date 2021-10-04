const { PostModel } = require('../connection ');

class PostService {

    static async add(newPost) {
        return await PostModel.create(newPost);
    }

    static async getAll() {
        var posts = await PostModel.findAll({
            raw: true,
            nest: true
        });
        return { posts: posts };
    }
    static async findPostsByUserId(idUser) {
        var postFilters = await PostModel.findAll({
            where: { 
                idUser: idUser
            },
            raw: true,
            nest: true
        });

        return { postFilters: postFilters };
    }
}

module.exports = {
    PostService
}
