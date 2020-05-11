const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user Schema and model
const userSchema = new Schema(
{
    username:
    {
        type: String,
        unique: true,
        required: [true, "Username field is required"]
    },
    available: 
    {
        type: Boolean,
        default: false
    },
    password:
    {
        type: String,
        required: [true, "Password field is required"]
    },
    drinkQueue: 
    {
        type: Object,
        default: []
    },
    storageTree:
    {
        type: Object
    },
    ingredientTree:
    {
        type: Object
    },
    favorites:
    {
        type: Object
    },
    shoppingList:
    {
        type: Object
    }
});
    
const User = mongoose.model('user', userSchema);

module.exports = User;