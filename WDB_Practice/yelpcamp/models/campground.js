const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumb').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async (cg) => {
    if (cg.reviews.length) {
        const result = await Review.deleteMany({ _id: { $in: cg.reviews } });
        console.log(result);
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);