const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


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

/* CAMPGROUND VALIDATION MIDDLEWARE **********************/
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}
/* REVIEW AUTHORIZATION MIDDLEWARE ******************************/
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', `You do not have permission to do that.`);
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

/* CAMPGROUND AUTHORIZATION MIDDLEWARE ******************************/
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', `You do not have permission to do that.`);
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

/* REVIEW VALIDATION MIDDLEWARE **************************/
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}