const express = require('express');
const app = express();
const sessionOptions = {secret: 'badsecret', resave: true, saveUninitialized: false}
const session = require('express-session');

app.use(session(sessionOptions));

app.get('/viewcount', (req, res) => {
    if (req.session.count) req.session.count += 1;
    else req.session.count = 1;
    res.send(`you've viewed this page ${req.session.count} times`);
});

app.listen(3000, () => {
    console.log('listening on localhost:3000');
});