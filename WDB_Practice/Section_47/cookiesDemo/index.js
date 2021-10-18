const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser('thesecret'));

app.get('/greet', (req, res) => {
    res.send('yo boi');
});

app.get('/setname', (req, res) => {
    res.cookie('city', 'chicago');
    res.send('gave you a cookie');
});

app.get('/getsignedcookie', (req, res) => {
    res.cookie('fruit', 'grape', {signed: true});
    res.send('sent a signed cookie');
});

app.listen(3000, () => {
    console.log('listening on localhost:3000');
});