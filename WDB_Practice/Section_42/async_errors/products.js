const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp')
    .then(() => {
        console.log("connection open");
    })
    .catch(err => {
        console.log("connection error");
        console.log(err);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    categories: [String],
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    }
});

const Product = mongoose.model('Product', productSchema);
// using class syntax, since mongoose.model returns a class
// const bike = new Product({ name: 'tire pump', price: 19.50, categories: ['cycling']});
// bike.save()
//     .then(data => {
//         console.log("it worked!");
//         console.log(data);
//     })
//     .catch(err => {
//         console.log('error');
//         console.log(err);
//     })

// const pump = new Product({ name: 'tire pump', price: 19.50, categories: ['cycling']});
// pump.save()
//     .then(data => {
//         console.log("it worked!");
//         console.log(data);
//     })
//     .catch(err => {
//         console.log('error');
//         console.log(err);
//     })

Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: -10.99 }, { new: true })
    .then(data => {
        console.log("it worked!");
        console.log(data);
    })
    .catch(err => {
        console.log('error');
        console.log(err);
    });

productSchema.methods.greet = function() {
    console.log("test lolol");
};