const bcrypt = require('bcrypt');

const hashPass = async (pw) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);

}

const login = async (inputPass, hashPass) => {
    const res = await bcrypt.compare(inputPass, hashPass); // returns true/false
    if (res)
        console.log('success, logged in')
    else
        console.log('incorrect, try again');
}

hashPass('monkey');