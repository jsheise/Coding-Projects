const PORT_NUM = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

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

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

/* HOME **************************************************/
app.get('/', (req, res) => {
    res.render('home.ejs', {});
})

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
