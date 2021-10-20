const PORT_NUM = 3000;
const User = require('./models/user');
const ejs = require('ejs');
const path = require('path');

const bcrypt = require('bcrypt');
const session = require('express-session');

/* Database connection setup *****************************/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/authDemoDB', {
    // how necessary are these options?
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch(err => {
        console.log("Mongo connection error");
        console.log(err);
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

/* Express setup *****************************************/
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // parses req.body

app.use(session(
    {
        secret: 'badsecret'
    }
));

/* Login middleware **************************************/
const requireLogin = ((req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
})


/* Routes setup ******************************************/
app.get('/', (req, res) => {
    res.send('home page');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({username: username, hashedPass: password});
    console.log('\r\n\r\nbeforesave\r\n\r\n');

    console.log(user);
    console.log('\r\n\r\n');

    await user.save();
    req.session.user_id = user._id;
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { password, username } = req.body;
    const user = await User.findAndValidate(username, password);
    if (user) {
        console.log(user)
        req.session.user_id = user._id;
        return res.redirect('/secret');
    }
    else
        return res.send('account with that user/pass not found; try again');

});
app.post('/logout', async (req, res) => {
    req.session.user_id = null;
    res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
})

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});