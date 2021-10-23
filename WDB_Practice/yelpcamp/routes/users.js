const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

/* REGISTER **********************************************/
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to YelpCamp, ${newUser.username}!`);
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

/* LOGIN *************************************************/
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    req.flash('success', 'Successfully logged in. Welcome back!');
    // console.log('LOGGED IN (testing currentUser');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}));

/* LOGOUT ***********************************************/
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("Successfully logged out.");
    res.redirect('/campgrounds');
});


module.exports = router;