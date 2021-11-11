const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.create = async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    cg.reviews.push(review);
    await cg.save();
    await review.save();
    req.flash('success', `Successfully added your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params;
    const cg = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('success', `Successfully deleted your review for ${cg.title}!`)
    res.redirect(`/campgrounds/${cg._id}`);
}