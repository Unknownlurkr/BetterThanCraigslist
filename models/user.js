const mongoose = require('mongoose');

//user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String
        
    },
    password: {
        type: String
       
    },
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


const Users = mongoose.model("User", UserSchema);

module.exports = Users;