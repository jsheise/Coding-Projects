const express = require('express');
const app = express();
const path = require('path');
const PORT_NUM = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const AppError = require('./AppError');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand2')
    .then(() => {
        console.log("mongo connection open");
    })
    .catch(err => {
        console.log("mongo connection error");
        console.log(err);
    });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const categories = ['fruit', 'vegetable', 'dairy'];

// ALL PRODUCTS *******************************************
app.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        if (category) {
            const productsReturned = await Product.find({ category: category });
            res.render('products/index', { productsReturned, category });
        } else {
            const productsReturned = await Product.find({});
            res.render('products/index', { productsReturned, category: 'All' });
        }
    } catch (e) {
        next(e);
    }
})

// ASYNC WRAPPER ******************************************
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

// NEW PRODUCT ********************************************
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
}))

// DETAILS ************************************************
app.get('/products/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const foundProduct = await Product.findById(id);
        if (!foundProduct) return next(new AppError('product not found', 404));
        res.render('products/details', { foundProduct });
        console.log(foundProduct);
}))

// EDIT ***************************************************
app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const foundProduct = await Product.findById(id);
        if (!foundProduct) return next(new AppError('product not found', 404));
        res.render('products/edit', { foundProduct, categories });
        console.log(foundProduct);
}))

app.put('/products/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
        res.redirect(`/products/${product._id}`);
        console.log(req.body);
}));

// DELETE *************************************************
app.delete('/products/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.redirect('/products/');
        console.log(req.body);
}))

// BASIC ERROR HANDLING ***********************************
app.use((err, req, res, next) => {
    const { status = 500, message = 'something went wrong' } = err; // err already has status and message
    res.status(status).send(message);
});

// START SERVER *******************************************
app.listen(PORT_NUM, () => {
    console.log(`listening on port ${PORT_NUM}`);
})