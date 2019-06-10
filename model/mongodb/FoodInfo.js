const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const FoodInfoSchema = new Schema({
    name: String,
    price: String
})
module.exports = model('FoodInfo', FoodInfoSchema)