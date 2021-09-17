const PORT_NUM = 3000;
const path = require('path');
const morgan = require('morgan');

/* Express setup *****************************************/
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// app.use(morgan('tiny'));
/*********************************************************/
app.use((req, res, next) => {
    console.log('first middleware');
    next();
    console.log('first middleware - after calling next()');
})
app.use((req, res, next) => {
    console.log('second middleware');
    next();
})
/*********************************************************/

app.get('/', (req, res) => {
    res.send('home page');
})

app.get('/dogs', (req, res) => {
    res.send('doggo page');
})

const verifyPassword = (req, res, next) => { 
    // console.log(req.query);
    const {pass} = req.query;
    if (pass === 'chicken') {
        next();
    } 
    res.send('sorry need password');
};

app.get('/secret', verifyPassword, (req, res) => {
    res.send('this is my secret');
})

app.get('/cats', (req, res) => {
    res.send('cat page');
})

app.use((req, res) => { res.status(404).send('NOT FOUND') });

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
}); 