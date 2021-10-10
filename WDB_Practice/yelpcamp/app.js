const PORT_NUM = 3000;
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const {campgroundSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

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
<<<<<<< HEAD
=======
    // if (!req.body.campground)
    //     throw new ExpressError('invalid campground data', 400);

>>>>>>> 0b2c9f19fcbb85cf701af4d9e3562542cb1d7eab
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
    const campground = await Campground.findById(id);
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

/* PATH NOT FOUND ERROR **********************************/
// using '*' to indicate "all paths other than the ones previously specified"
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

/* GENERIC ERROR HANDLER *********************************/
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong!!!' } = err;
    if(!err.message) err.message = 'something went wrong!!';
    res.status(statusCode).render('error', { err });
})

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});
