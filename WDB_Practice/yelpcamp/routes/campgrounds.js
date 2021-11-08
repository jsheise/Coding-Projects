const express = require('express');
const router = express.Router(); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

const Joi = require('joi');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');

/* MAIN PAGE *********************************************/
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    // console.log('req.currentUser in campgrounds route handler: ', req.currentUser);
    // console.log('req.user in campgrounds route handler: ', req.user);
    res.render('campgrounds/index', { campgrounds });
}))

/* CREATE ************************************************/
router.get('/create', isLoggedIn, (req, res) => {
    res.render('campgrounds/create', {});
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    const { id } = newCampground;
    // console.log(id);
    req.flash('success', `Successfully created ${newCampground.title}!`);
    res.redirect(`campgrounds/${id}`);
}));

/* DETAILS ***********************************************/
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews', // for every review, populate its author
            populate: {
                path: 'author'
            }
        })
        .populate('author'); // separately, populate the campground author
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Sorry, cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render(`campgrounds/details`, { campground });
}))


/* EDIT **************************************************/
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', `Successfully updated ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}))

/* DELETE ************************************************/
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${campground.title}!`);
    res.redirect('/campgrounds');
}));

module.exports = router;