const User = require('../models/user');

/* REGISTER **********************************************/
module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}
module.exports.register = async (req, res) => {
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
}

/* LOGIN *************************************************/
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}
module.exports.login = async (req, res) => {
    req.flash('success', 'Successfully logged in. Welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

/* LOGOUT ***********************************************/
module.exports.logout = (req, res) => {
    req.logout();
    req.session.returnTo = null;
    req.flash("Successfully logged out.");
    res.redirect('/campgrounds');
}