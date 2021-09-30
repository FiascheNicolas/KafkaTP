const express = require('express');
const router = express.Router();

const {UserService} = require('../services/UserService');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); //Método a utilizar en la vista que quiero proteger

/*
 * GET pagina de registro
 */
/*
router.get('/index', isNotLoggedIn, (req, res) => {
  res.render('index', { page_title: 'Index' });
});
*/
router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register', { page_title: 'Registro de usuario' });
});

router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/login',
  failureRedirect: '/register',
  failereFlash: true
})); //especifico donde quiero que vaya si se autentica o si falla

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { page_title: 'Login' });
});

router.post('/login', (req, res, next) =>{
  console.log("user js");
  passport.authenticate('local.signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
  })(req, res);
});

router.get('/logout', (req, res) => {
  req.logOut(); //Función de passport para eliminar la sesión
  res.render('login', { page_title: 'Login' });
});

//HOME
router.get('/home', isLoggedIn, (req, res) => {
  res.render('home', { page_title: 'Home' });
});

module.exports = router;