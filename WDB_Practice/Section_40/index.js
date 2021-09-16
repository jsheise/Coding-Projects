const PORT_NUM = 3000;
const path = require('path');
const morgan = require('morgan');



/* Express setup *****************************************/
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('tiny'));

/*********************************************************/

app.get('/', (req, res) => {
    res.send('home page');
})

app.get('/dogs', (req, res) => {
    res.send('doggo page');
})

app.listen(PORT_NUM, () => {
    console.log(`Serving on port ${PORT_NUM}`);
});