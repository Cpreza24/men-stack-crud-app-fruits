const dotenv = require("dotenv")
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Fruit = require('./models/fruit.js');

//Line 17 must go on top of the post request
//this middleware allows access to the req.body, will come up as undefined without it. 
app.use(express.urlencoded({ extended: false }));


app.get('/', async (req, res) => {
    res.render('index.ejs')
});

app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

// Post (create) to create new fruits
app.post("/fruits", async (req, res) => {
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    res.redirect("/fruits/new");
});

// You do 
//Update fruit model to have a price (Number)
// update /fruits/new form to accept a price from the user




app.listen(3030, () => {
    console.log('listening on port 3030');
});