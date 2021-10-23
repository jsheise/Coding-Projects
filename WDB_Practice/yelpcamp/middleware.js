module.exports.isLoggedIn = (req, res, next) => {
    // console.log('req.currentUser in isLoggedIn middleware: ', req.currentUser);
    // console.log('req.user in isLoggedIn middleware: ', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', "You must be signed in to do that.");
        return res.redirect('/login');
    }
    next();
}