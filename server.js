const express = require('express');
const app = express();


app.get('/', async (req, res) => {
    res.render('index.ejs')
})





app.listen(3030, () => {
    console.log('listening on port 3030');
})