const express = require('express');
const router = express.Router({ mergeParams: true }); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

/* CREATE ************************************************/
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    cg.reviews.push(review);
    await cg.save();
    await review.save();
    req.flash('success', `Successfully added your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
}));

/* DELETE ************************************************/
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const cg = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Successfully deleted your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
    // cg.reviews.push(review);
    // await cg.save();
}));

module.exports = router;