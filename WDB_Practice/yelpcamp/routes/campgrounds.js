const express = require('express');
const router = express.Router(); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('../schemas')

/* VALIDATION MIDDLEWARE *********************************/
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

/* MAIN PAGES ********************************************/
// router.get('/', (req, res) => {
//     res.render('home.ejs', {});
// })
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

/* CREATE ************************************************/
router.get('/create', (req, res) => {
    res.render('campgrounds/create', {});
})

router.post('/', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //     throw new ExpressError('invalid campground data', 400);

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    const {id} = newCampground;
    // console.log(id);
    res.redirect(`campgrounds/${id}`);
}));

/* DETAILS ***********************************************/
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findById(id).populate('reviews');
    // console.log(campground);
    res.render(`campgrounds/details`, { campground });
}))

/* EDIT **************************************************/
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}))

/* DELETE ************************************************/
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds'); 
}));

module.exports = router;