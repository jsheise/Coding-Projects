const PORT_NUM = 3000;
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate'); // for partials
const ExpressError = require('./utils/ExpressError');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

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
app.engine('ejs', ejsMate); // for partials

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'badsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        HttpOnly: true
    }
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/', userRoutes);

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
    if (!err.message) err.message = 'something went wrong!!';
    res.status(statusCode).render('error', { err });
});

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});
