const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp')
    .then(() => {
        console.log("connection open");
    })
    .catch(err => {
        console.log("connection error");
        console.log(err);
    });

const personSchema = new mongoose.Schema({
    first: String,
    last: String
})

personSchema.virtual('fullName').get()