const express = require('express');
const app = express();
const path = require('path');
const redditData = require('./data.json');

app.use(express.static( path.join(__dirname, '/public')));

// setting EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render('home');
});

// for loop demo
app.get('/cats', (req, res) => {
    const allCats = ['ace', 'nick,', 'furball', 'tony']; // pretend database
    res.render('cats', { allCats });
});

// path params demo
// app.get('/r/:subr', (req, res) => {
//     const subredditName = req.params.subr;
//     const data = redditData[subredditName]; // note use of the name value we get from the URL
//     console.log(data);
//     res.render('subreddit', {subredditName});
// });

// more complex subreddit demo
app.get('/r/:subr', (req, res) => {
    const subredditName = req.params.subr;
    const data = redditData[subredditName]; // note use of the name value we get from the URL
    if (data) {
        console.log(data);
        res.render('subreddit', { ...data });
    } else res.render('notfound', { subredditName });
});

// passing values demo
app.get('/rand', (req, res) => {
    const randNum = Math.floor(Math.random() * 10) + 1;
    res.render('random', { randNum: randNum });
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});

