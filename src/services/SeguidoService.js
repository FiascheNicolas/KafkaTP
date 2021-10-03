const {SeguidoModel} = require('../connection ');

class SeguidoService {

    static async add(newFollow){
        return await SeguidoModel.create(newFollow); 
    }

    static async getAll(){
        var sguidores = await SeguidoModel.findAll({
            raw: true,
            nest: true
        });
        return  {sguidores: sguidores};
    }
}

module.exports = {
    SeguidoService
}
