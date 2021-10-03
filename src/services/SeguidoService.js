const {SeguidoModel} = require('../connection ');

class SeguidoService {

    static async add(newFollow){
        return await SeguidoModel.create(newFollow); 
    }

    static async getAll(){
        var seguidores = await SeguidoModel.findAll({
            raw: true,
            nest: true
        });
        return  {seguidores: seguidores};
    }
}

module.exports = {
    SeguidoService
}
