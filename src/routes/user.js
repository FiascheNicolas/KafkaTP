const express = require('express');
const router = express.Router();
const {UserService} = require('../services/UserService');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth'); 
const notificacion = require('../lib/notificaciones');
router.get('/register', isNotLoggedIn, (req, res) => {
  res.render('register', { page_title: 'Registro de usuario' });
});
router.post('/register', passport.authenticate('local.signup', {
  successRedirect: '/login',
  failureRedirect: '/register',
  failereFlash: true
})); 
router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', { page_title: 'Login' });
});
router.post('/login', (req, res, next) =>{
  passport.authenticate('local.signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
  })(req, res);
});
router.get('/logout', (req, res) => {
  req.logOut(); 
  res.render('login', { page_title: 'Login' });
});
module.exports = router;