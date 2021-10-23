const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocMon = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
userSchema.plugin(passportLocMon);

const User = mongoose.model('User', userSchema);
module.exports = User;