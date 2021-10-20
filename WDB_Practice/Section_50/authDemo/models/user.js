const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    username: {
        type: String,
        required: ['true', 'Username cannot be blank']
    },
    hashedPass: {
        type: String,
        required: ['true', 'Password cannot be blank']
    }
})

userSchema.statics.findAndValidate = async function (userIn, passIn) {
    console.log('findandvalidate log')
    const user = await this.findOne({ userIn });
    const isValidPass = await bcrypt.compare(passIn, user.hashedPass);
    return isValidPass ? user : false;
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('hashedPass')) return next();
    this.hashedPass = await bcrypt.hash(this.hashedPass, 12); 
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;