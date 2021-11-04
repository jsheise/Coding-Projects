const Campground = require('../models/campground');
const Review = require('../models/review');
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
    await Review.deleteMany({});

    for (let i = 0; i < 4; i++) {
        const randIndex = Math.floor(Math.random() * 1000);
        const randPrice = Math.floor(Math.random() * 30) + 10;

        // inefficient to create reviews with the campground, but whatever
        const randRating1 = Math.floor(Math.random() * 5);
        const randRating2 = Math.floor(Math.random() * 5);

        const review1 = new Review({rating: randRating1, body: `campground ${i}, review 1`});
        const review2 = new Review({rating: randRating2, body: `campground ${i}, review 2`});
        
        const c = new Campground({
            location: `${cities[randIndex].city}, ${cities[randIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://picsum.photos/1000/1000',
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, possimus! Laboriosam eligendi dolor tempore obcaecati ex consectetur molestiae. Omnis soluta eveniet quae exercitationem veniam laudantium explicabo expedita. Atque, eum debitis.',
            price: randPrice,
            reviews: []
        });

        c.reviews.push(review1);
        c.reviews.push(review2);
        await review1.save();
        await review2.save();
        await c.save();
    }
}

console.log(typeof Review);
console.log(typeof Campground);

seedDB().then((() => mongoose.connection.close()));