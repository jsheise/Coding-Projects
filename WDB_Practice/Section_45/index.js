const express = require('express');
const app = express();
const path = require('path');
const PORT_NUM = 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const AppError = require('./AppError');

const Product = require('./models/product');
const Farm = require('./models/farm')

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

// ASYNC WRAPPER ******************************************
function catchAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e));
    }
}

/* FARM ROUTES ********************************************
**********************************************************/

// ALL FARMS *******************************************
app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms });
})

// NEW FARM ********************************************
app.get('/farms/new', (req, res) => {
    res.render('farms/new');
})

app.post('/farms', async (req, res) => {
    const newFarm = new Farm(req.body);
    await newFarm.save();
    res.redirect('/farms');
})

// DETAILS ************************************************ 
app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('products');
    res.render('farms/details', { farm });
})

// ADD PRODUCT TO FARM ************************************
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const currentFarm = await Farm.findById(id);
    // console.log(currentFarm);
    res.render('products/new', { categories, id, currentFarm }); // remember: categories is enum defined above
})

app.post('/farms/:id/products', catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    const { name, price, category } = req.body;
    const newProduct = new Product({ name, price, category });
    farm.products.push(newProduct);
    newProduct.farm = farm;
    await newProduct.save();
    await farm.save();
    res.redirect(`/farms/${id}`);
}));

// DELETE FARM ********************************************* 
app.delete('/farms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedFarm = await Farm.findByIdAndDelete(id);
    // console.log('testing delete');
    res.redirect('/farms');
}));

// app.post('/farms', catchAsync(async (req, res, next) => {
//     const newProduct = new Product(req.body);
//     await newProduct.save();
//     res.redirect(`/products/${newProduct._id}`);
// }))


/* PRODUCT ROUTES *****************************************
**********************************************************/

// ALL PRODUCTS *******************************************
app.get('/products', catchAsync(async (req, res) => {
    const { category } = req.query;
    if (category) {
        const productsReturned = await Product.find({ category: category });
        res.render('products/index', { productsReturned, category });
    } else {
        const productsReturned = await Product.find({});
        res.render('products/index', { productsReturned, category: 'All' });
    }
}))

// NEW PRODUCT ********************************************
app.get('/products/new', (req, res) => {
    res.render('products/new', { categories });
})

app.post('/products', catchAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
}))

// DETAILS ************************************************
app.get('/products/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id).populate('farm');
    if (!foundProduct) return next(new AppError('product not found', 404));
    res.render('products/details', { foundProduct });
    // console.log(foundProduct);
}))

// EDIT ***************************************************
app.get('/products/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    if (!foundProduct) return next(new AppError('product not found', 404));
    const allFarms = await Farm.find();
    res.render('products/edit', { foundProduct, categories, allFarms });
    // console.log(foundProduct);
}))

app.put('/products/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { farmId, productName, productPrice, productCategory } = req.body;

    console.log(`product ID: ${id}, farm ID: ${farmId}`);
    // res.send(req.body);

    const farm = await Farm.findById(farmId);
    // console.log(farm);
    const product = await Product.findByIdAndUpdate(id,
        {
            productName,
            productPrice,
            productCategory,
            farm
        }, { runValidators: true, new: true })
    console.log(product);
    res.redirect(`/products/${product._id}`);
    // console.log(req.body);
}));

// DELETE *************************************************
app.delete('/products/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products/');
    // console.log(req.body);
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