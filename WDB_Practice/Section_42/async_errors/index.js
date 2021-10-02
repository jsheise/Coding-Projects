const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/movieApp')
    .then(() => {
        console.log("connection open");
    })
    .catch(err => {
        console.log("connection error");
        console.log(err);
    });

const movieSchema = new mongoose.Schema({
    title: String,
    year: Number,
    score: Number,
    rating: String
});

const Movie = mongoose.model('Movie', movieSchema);
const alien = new Movie({ title: 'Alien', year: 1979, score: 9.2, rating: 'R'}); 