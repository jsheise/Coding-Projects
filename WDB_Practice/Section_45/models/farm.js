const mongoose = require('mongoose');
const {Schema} = mongoose; // destructuring from Mongoose package
const Product = require('./product');
const farmSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Farm must have a name!'] // apparently we're able to provide a message??
    },
    city: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

farmSchema.post('findOneAndDelete', async (farm) => {
    if(farm.products.length) {
        const result = await Product.deleteMany({_id: {$in: farm.products}});
        console.log(result);
    }
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;