const express = require('express');
const app = express();

// app.use((req, res) => {
//     console.log("received new request!");
//     res.send("entered .use route(?)");
// });

app.get('/cats', (req, res) => {
    console.log("cat request!");
    res.send("sending back cat response!");
});

app.get('/r/:subreddit', (req, res) => {
    res.send('subreddit!');
});

app.get('/search', (req, res) => {
    const {q} = req.query;
    if (!q) {
        res.send("nothing found :(");
    }
    res.send(`<h1>results for: ${q}!!!</h1>`);
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});