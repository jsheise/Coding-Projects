const Campground = require('../models/campground');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

/* Database connection setup *****************************/
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
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randIndex = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 30) +10;
        const c = new Campground({
            location: `${cities[randIndex].city}, ${cities[randIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, possimus! Laboriosam eligendi dolor tempore obcaecati ex consectetur molestiae. Omnis soluta eveniet quae exercitationem veniam laudantium explicabo expedita. Atque, eum debitis.',
            price: randPrice
        });
        // console.log(c);
        await c.save();
    }
}

seedDB().then((()=> mongoose.connection.close()));