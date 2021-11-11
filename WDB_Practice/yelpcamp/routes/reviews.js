const express = require('express');
const router = express.Router({ mergeParams: true }); // built-in to Express

const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

/* CREATE ************************************************/
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.create));

/* DELETE ************************************************/
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.delete));

module.exports = router;