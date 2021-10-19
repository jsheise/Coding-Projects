const express = require('express');
const router = express.Router({mergeParams: true}); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');

const Joi = require('joi');
const {reviewSchema} = require('../schemas');

/* VALIDATION MIDDLEWARE *********************************/
const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

/* CREATE ************************************************/
router.post('/', validateReview, catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    cg.reviews.push(review);
    await cg.save();
    await review.save();
    req.flash('success', `Successfully added your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
}));

/* DELETE ************************************************/
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const cg = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Successfully deleted your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
    // cg.reviews.push(review);
    // await cg.save();
}));

module.exports = router;