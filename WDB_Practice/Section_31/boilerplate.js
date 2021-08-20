const fs = require('fs');
const folderName = process.argv[2];

try {
    fs.mkdirSync(folderName.toString());
    fs.writeFileSync(`${folderName}/index.html`, '');
    fs.writeFileSync(`${folderName}/app.js`, '');
    fs.writeFileSync(`${folderName}/styles.css`, '');
} catch (e) {
    console.log('something went wrong!');
    console.log(e);
}