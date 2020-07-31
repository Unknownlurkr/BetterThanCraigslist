const mongoose = require('mongoose');

//creating a seperate schema for items
const ItemsSchema = new mongoose.Schema({
    item: {
        type: String
    },
    price: {
        type: double
    },
    city: {
        type: String
    },
    contact: {
        type: String
    },
    userId: {
        type: Int
    }
});

const Items = mongoose.model("Items", ItemsSchema);