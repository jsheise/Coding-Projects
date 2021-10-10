/* Database connection setup *****************************/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/relationshipsDemo', {
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
/*********************************************************/

const { Schema } = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    season: {
        type: String,
        enum: ['Spring', 'Winter', 'Fall', 'Summer']
    }
});
const farmSchema = new Schema({
    name: String,
    city: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

const Product = new mongoose.model('Product', productSchema);
const Farm = new mongoose.model('Farm', farmSchema);

const makeFarm = async () => {
    const farm = new Farm({ name: "Full Belly Farms", city: "Guinda, CA" });
    const melon = await Product.fineOne({ name: 'Goddess Melon' });
    farm.products.push(melon);
}

// Product.insertMany([
//     {name: 'Goddess Melon', price: 5, season: 'Summer'},
//     {name: 'Sugar Baby Watermelon', price: 5, season: 'Summer'},
// ]);