const mongoose = require('mongoose');

//creating a seperate schema for items
const ItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    }
});

const Items = mongoose.model("Items", ItemsSchema);


module.exports = Items;