const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; //Autenticación de manera local
const {UserService} = require('../services/UserService');
const {UserModel} = require('../connection ');
const {sequelize} = require('../connection ');
const helpers = require('../lib/helpers');

//Autenticación de nombre local.signup
passport.use('local.signup', new LocalStrategy({
  usernameField: 'username', //recibiré de la vista un usuario
  passwordField: 'password', //la contraseña
  passReqToCallback: true //para recibir mas datos, obtenidos desde el request
}, async (req, username, password, done) => { 
 
    //callback que se ejecuta despues de LocalStrategy
    //recibe el request, username y password, done (callback para continuar con el resto del codigo)
    const { name } = req.body;
    let newUser = {
      name,
      username,
      password
    };
    newUser.password = await helpers.encryptPassword(password); //desde helpers, encripto la pass
    // Guardo el user
    const result = await UserService.add(newUser);
    //console.log(result.id);
    newUser.id = result.id;
    return done(null, newUser);
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  console.log("PASSPORT");

  const rows = await sequelize.query('SELECT * FROM usuarios WHERE username = :username', {
    replacements: { username: username }, type: sequelize.QueryTypes.SELECT });
  //const rows = await UserService.getByUser(username);
  //console.log("DESPUES DE LA QUERY SEQUELIZE");
  //console.log(rows);
  if (rows.length > 0) {
    const user = rows[0];
    const validPassword = await helpers.matchPassword(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('success', 'Bienvenido ' + user.username));
    } else {
      done(null, false, req.flash('message', 'Contraseña incorrecta.'));
    }
  } else {
    return done(null, false, req.flash('message', 'El usuario no existe.'));
  }
}));

//SERIALIZO EL USER EN BASE AL ID
passport.serializeUser((user, done) => {
  done(null, user.id); //vamos a poder guardar la session
});

//DESERIALIZO EN BASE AL ID
passport.deserializeUser(async (id, done) => {
  const users = await UserService.getById(id);
  done(null, users);
});