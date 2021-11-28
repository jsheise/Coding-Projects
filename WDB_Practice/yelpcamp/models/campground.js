const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review');

const ImageSchema=new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumb').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
ImageSchema.virtual('carousel').get(function () {
    return this.url.replace('/upload', '/upload/h_300,c_scale');
})

const cgSchemaOpts={ toJSON: { virtuals: true } };

const CampgroundSchema=new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
}, cgSchemaOpts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</strong>
    <br>
    <img src="${this.images[0].thumb}">`
})

CampgroundSchema.post('findOneAndDelete', async (cg) => {
    if (cg.reviews.length) {
        const result=await Review.deleteMany({ _id: { $in: cg.reviews } });
        console.log(result);
    }
})

module.exports=mongoose.model('Campground', CampgroundSchema);