const bcrypt = require('bcryptjs');

const helpers = {};

//METODO UTILIZADO EN EL REGISTER
helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //genero un patron
  const hash = await bcrypt.hash(password, salt); //le doy la pass y el patron
  return hash;
};

//METODO UTILIZADO EN EL LOGIN
//compara las contraseñas
helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword); //compara lo que ya tengo guardado con lo que trata de logearse
  } catch (e) {
    console.log(e)
  }
};

module.exports = helpers;