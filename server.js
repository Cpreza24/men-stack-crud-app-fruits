const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Fruit = require('./models/fruit.js');

//Line 17 must go on top of the post request
//this middleware allows access to the req.body, will come up as undefined without it.
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

//INDEX ROUTE
app.get('/fruits', async (req, res) => {
    const allFruits = await Fruit.find({});
    res.render('fruits/index.ejs', { fruits: allFruits });
    //res.redirect('/fruits');
});

//NEW ROUTE
app.get('/fruits/new', (req, res) => {
    res.render('fruits/new.ejs');
});

//SHOW ROUTE
app.get('/fruits/:fruitId', async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render(`fruits/show.ejs`, { fruit: foundFruit });
});

app.put("/fruits/:fruitId", async (req, res) => {
    console.log('request body before transformation', req.body)
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    console.log('request body after transformation', req.body)

    // Update the fruit in the database (Mongo Query)
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);

    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
    });

// CREATE ROUTE
app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === 'on') {
        req.body.isReadyToEat = true;
    } else {
        req.body.isReadyToEat = false;
    }
    await Fruit.create(req.body);
    console.log(req.body);
    res.redirect('/fruits/new');
});

app.get('/fruits/:fruitId/edit', async (req, res) => {
    // Mongo Query (findById returns one record)
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render('fruits/edit.ejs', { fruit: foundFruit });
});

app.delete('/fruits/:fruitId', async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect('/fruits');
});

// You do
//Update fruit model to have a price (Number)
// update /fruits/new form to accept a price from the user

app.listen(3030, () => {
    console.log('listening on port 3030');
});
