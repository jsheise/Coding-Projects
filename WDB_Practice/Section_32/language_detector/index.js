import { franc, francAll } from 'franc';

// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const langs = require('langs');
const colors = require('colors');
const userInput = process.argv[2];

// console.log(userInput); // make sure we're getting the correct input
// console.log(franc('Alle menslike wesens word vry')); // => 'afr'
try {
    const langCode = franc(userInput);
    const language = langs.where("3", langCode).name;
    console.log(language.blue);
} catch (e) {
    console.log("error: could not successfully determine language code".red);
    // console.log(e);
}

// COLT USED IF/THEN STATEMENT, SINCE franc WILL RETURN 'und' FOR UNDETERMINED LANGUAGE CODE
// if (langCode === 'und') {
//     console.log("error: could not successfully determine language code".red);
// } else {
//     const language = langs.where("3", langCode).name;
//     console.log(language);
// }


// https://www.kindacode.com/article/node-js-how-to-use-import-and-require-in-the-same-file/