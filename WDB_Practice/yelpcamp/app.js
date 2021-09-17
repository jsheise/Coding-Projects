const PORT_NUM = 3000;
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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

/*********************************************************/

app.get('/', (req, res) => {
    res.render('home.ejs', {});
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})


/* CREATE ************************************************/
app.get('/campgrounds/create', (req, res) => {
    res.render('campgrounds/create', {});
})

app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`);
});

/* DETAILS ***********************************************/
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/details', { campground });
})

/* EDIT **************************************************/
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    console.log(campground);
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, {new: true});
    res.redirect(`/campgrounds/${campground._id}`);
});

/* DELETE ************************************************/
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});