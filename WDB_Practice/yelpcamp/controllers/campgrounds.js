// const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
// const { isLoggedIn, validateCampground, isAuthor } = require('../middleware';
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken }); // instantiated as "baseClient" in docs

/* INDEX PAGE ********************************************/
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

/* CREATE ************************************************/
module.exports.renderCreateForm = (req, res) => {
    res.render('campgrounds/create', {});
};

module.exports.create = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    // console.log(req.body.campground.location);
    // console.log(geoData);
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    newCampground.geometry = geoData.body.features[0].geometry;
    // console.dir(req.files);
    newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.dir(newCampground);
    await newCampground.save();
    const { id } = newCampground;
    // console.log(id);
    console.log(newCampground);
    req.flash('success', `Successfully created ${newCampground.title}!`);
    res.redirect(`campgrounds/${id}`);
};

/* DETAILS ***********************************************/
module.exports.details = async (req, res) => {
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
}

/* EDIT **************************************************/
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Sorry, cannot find that campground!')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.submitEdit = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    // console.dir(imgs);
    campground.images.push(...imgs);
    await campground.save(); // wasn't seeing images on CGs in Mongo despite seeing them on Cloudinary

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Successfully updated ${campground.title}!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

/* DELETE ************************************************/
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${campground.title}!`);
    res.redirect('/campgrounds');
}