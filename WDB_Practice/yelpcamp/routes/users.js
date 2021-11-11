const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');

/* REGISTER **********************************************/
router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.register));
// router.get('/register', users.renderRegisterForm);
// router.post('/register', catchAsync(users.register));

/* LOGIN *************************************************/
router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), 
        catchAsync(users.login));

/* LOGOUT ***********************************************/
router.get('/logout', users.logout);

module.exports = router;