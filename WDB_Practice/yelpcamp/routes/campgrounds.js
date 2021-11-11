const express = require('express');
const router = express.Router(); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

const Joi = require('joi');

const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const campground = require('../models/campground');

const { storage } = require('../cloudinary')

const multer = require('multer');
const { reset } = require('nodemon');
const upload = multer({ storage })

/* INDEX PAGE AND CREATE POST ROUTE **********************/
router.route('/')
    .get(catchAsync(campgrounds.index))
.post(isLoggedIn,
    validateCampground,
    upload.array('image'),
    catchAsync(campgrounds.create));

/* CREATE ************************************************/
router.get('/create', isLoggedIn, campgrounds.renderCreateForm)

/* DETAILS, EDIT PUT ROUTE, DELETE ROUTE *****************/
router.route('/:id')
    .get(catchAsync(campgrounds.details))
    .put(isLoggedIn,
        isAuthor,
        validateCampground,
        catchAsync(campgrounds.submitEdit))
    .delete(isLoggedIn,
        isAuthor,
        catchAsync(campgrounds.delete));

/* EDIT **************************************************/
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;