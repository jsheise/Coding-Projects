const PORT_NUM = 3000;
const path = require('path');
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

// this is to test commiting and pushing from my Linux Mint XPS

// continuing to work and remember how git works lol

/* Database connection setup *****************************/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp-db', {
    // how necessary are these options?
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch(err => {
        console.log("Mongo connection error");
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

/* Express setup *****************************************/
const express = require('express');
const app = express();

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

/* VALIDATION MIDDLEWARE *********************************/
const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    console.log(error);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

/* MAIN PAGES ********************************************/
app.get('/', (req, res) => {
    res.render('home.ejs', {});
})
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

/* CREATE ************************************************/
app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create', {});
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.campground)
    //     throw new ExpressError('invalid campground data', 400);

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    const {id} = newCampground;
    // console.log(id);
    res.redirect(`campgrounds/${id}`);
}));

/* DETAILS ***********************************************/
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const campground = await Campground.findById(id).populate('reviews');
    // console.log(campground);
    res.render(`campgrounds/details`, { campground });
}))

/* EDIT **************************************************/
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // console.log(campground);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
}))

/* DELETE ************************************************/
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds'); 
}));

/* REVIEW ROUTES *****************************************/
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const cg = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    cg.reviews.push(review);
    await cg.save();
    await review.save();
    res.redirect(`/campgrounds/${cg._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    const cg = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${cg._id}`);
    // cg.reviews.push(review);
    // await cg.save();
}));

/* PATH NOT FOUND ERROR **********************************/
// using '*' to indicate "all paths other than the ones previously specified"
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
}); 

/* GENERIC ERROR HANDLER *********************************/
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong!!!' } = err;
    if(!err.message) err.message = 'something went wrong!!';
    res.status(statusCode).render('error', { err });
});

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});
