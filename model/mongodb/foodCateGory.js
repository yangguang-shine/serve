const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const FoodCategorySchema = new Schema({
    foodCategoryName: String,
    foodCategoryId: Number,
    foodList: [
        {
            foodId: Number,
            imgUrl: String,
            price: Number,
            foodName: String,
            description: String,
            orderCount: {
                type: Number,
                default: 0
            }
        }
    ]
})
module.exports = model('FoodCategory', FoodCategorySchema)