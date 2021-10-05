const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const {UserService} = require('../services/UserService');
const {UserModel} = require('../connection ');
const {sequelize} = require('../connection ');
const helpers = require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username', 
  passwordField: 'password', 
  passReqToCallback: true 
}, async (req, username, password, done) => { 
    const { name } = req.body;
    let newUser = {
      name,
      username,
      password
    };
    newUser.password = await helpers.encryptPassword(password); 
    const result = await UserService.add(newUser);
    newUser.id = result.id;
    return done(null, newUser);
}));

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await sequelize.query('SELECT * FROM usuarios WHERE username = :username', {
    replacements: { username: username }, type: sequelize.QueryTypes.SELECT });
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
passport.serializeUser((user, done) => {
  done(null, user.id); 
});
passport.deserializeUser(async (id, done) => {
  const users = await UserService.getById(id);
  done(null, users);
});