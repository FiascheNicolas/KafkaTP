const {SubscripcionModel} = require('../connection ');

class SubscripcionService {

    static async add(followName , idUser){
        const newSuscriptionPost = {
            "followName" : followName,
            "idUser" : idUser,
        }
        return await SubscripcionModel.create(newSuscriptionPost); 
    }

    static async getAll(id){
        var usersSuscriptos = await SubscripcionModel.findAll({
            where: { /** ME TRAE TODOS LOS USUARIOS QUE CUMPLAN EL PARAMETRO INDICADO*/
                idUser: id
            },
            raw: true,
            nest: true
         });
        return  {usersSuscriptos};    
    }

}

module.exports = {
    SubscripcionService
}
