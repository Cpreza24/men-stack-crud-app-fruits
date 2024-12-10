const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,
});

//Capitalized classes signals that its a class, responds to ongoose model actions
// DB models are classes
const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit; 