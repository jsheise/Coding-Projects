const express = require('express');
const app = express();
const path = require('path');
const PORT_NUM = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand')
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
    const { category } = req.query;
    if (category) {
        const productsReturned = await Product.find({ category: category });
        res.render('products/index', { productsReturned, category});
    } else {
        const productsReturned = await Product.find({});
        res.render('products/index', { productsReturned, category: 'All' });
    } 
})

// NEW PRODUCT ********************************************
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
    // res.send('making product');
})

// DETAILS ************************************************
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    // link explaining the above line's syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    const foundProduct = await Product.findById(id);
    res.render('products/details', { foundProduct });
    console.log(foundProduct);
})

// EDIT ***************************************************
app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    res.render('products/edit', { foundProduct, categories });
    console.log(foundProduct);
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/products/${product._id}`);
    // res.send('PUT');
    console.log(req.body);
})

// DELETE *************************************************
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products/');
    // res.send('DELETE');
    console.log(req.body);
})

// START SERVER *******************************************
app.listen(PORT_NUM, () => {
    console.log(`listening on port ${PORT_NUM}`);
})