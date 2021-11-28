const Campground=require('../models/campground');
const mongoose=require('mongoose');
const cities=require('./cities');
const { places, descriptors }=require('./seedHelpers');

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

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample=(array) => array[Math.floor(Math.random()*array.length)];

const seedDB=async () => {
    await Campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const randIndex=Math.floor(Math.random()*1000);
        const randPrice=Math.floor(Math.random()*30)+10;
        const location=`${cities[randIndex].city}, ${cities[randIndex].state}`;

        const c=new Campground({
            author: '617197bb279f695d6d34c99d',
            location: location,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randIndex].longitude,
                    cities[randIndex].latitude
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, possimus! Laboriosam eligendi dolor tempore obcaecati ex consectetur molestiae. Omnis soluta eveniet quae exercitationem veniam laudantium explicabo expedita. Atque, eum debitis.',
            price: randPrice,
            images: [
                {
                    url: 'https://res.cloudinary.com/dkrg6xrw3/image/upload/v1636734441/YelpCamp/c5k1ejqjh0y2ywg4yqwp.jpg',
                    filename: 'YelpCamp/c5k1ejqjh0y2ywg4yqwp'
                },
                {
                    url: 'https://res.cloudinary.com/dkrg6xrw3/image/upload/v1636734441/YelpCamp/mzfrjf9vljthm3ebk0gg.jpg',
                    filename: 'YelpCamp/mzfrjf9vljthm3ebk0gg'
                }
            ]
        });
        // console.log(c);
        await c.save();
    }
}

seedDB().then((() => mongoose.connection.close()));