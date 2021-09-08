const { Resolver } = require('dns');
const express = require('express');
const app = express();
const PORT_NUM = 3000;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

// array of objects for comment substitute
let comments = [
    {
        id: uuidv4(),
        username: 'todd',
        comment: 'lol nice'
    },
    {
        id: uuidv4(),
        username: 'mika',
        comment: 'fuk off m8'
    },
    {
        id: uuidv4(),
        username: 'lucky',
        comment: 'winning!'
    },
    {
        id: uuidv4(),
        username: 'jake',
        comment: 'k'
    },
]

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//https://stackoverflow.com/questions/51840864/typeerror-view-is-not-a-constructor-ejs
app.use(methodOverride('_method'));

app.get('/comments', (req, res) => {
    res.render('comments/index', { comments });
});

app.post('/comments', (req, res) => {
    // console.log(req.body);
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuidv4() });
    // res.send("worked!");
    res.redirect('/comments');
});

app.get('/comments/:id', (req, res) => {
    // console.log(typeof(req.params.id));
    const id = req.params.id; // Colt manages to use { id }, but that breaks my version
    const comment = comments.find(c => c.id === id);
    // console.log(comment);
    res.render('comments/details', { comment });
});

app.patch('/comments/:id', (req, res) => {
    // res.send('updating something!'); console.log('sent something');
    // console.log(req.body.comment); res.send('got it');
    const id = req.params.id;
    const newCommentText = req.body.comment;
    const commentMatch = comments.find(c => c.id === id);
    commentMatch.comment = newCommentText;
    res.redirect('/comments');
});

app.get('/comments/:id/edit', (req, res) => {
    const id = req.params.id;
    const commentMatch = comments.find(c => c.id === id);
    res.render('comments/edit', { commentMatch });
});

app.get('/comments/new', (req, res) => {
    res.render('comments/new', {});
});

app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    // const commentMatch = comments.find(c => c.id === id); // don't need if using filter
    comments = comments.filter(c => c.id !== id);
    res.redirect('/comments');

});

// app.get('', (req, res) => {

// });

// app.post('', (req, res) => {

// });

app.listen(PORT_NUM, () => {
    console.log(`listening on port ${PORT_NUM}`);
})