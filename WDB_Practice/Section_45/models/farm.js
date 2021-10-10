const mongoose = require('mongoose');
const {Schema} = mongoose; // destructuring from Mongoose package

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

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;