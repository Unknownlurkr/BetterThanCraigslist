const mongoose = require('mongoose');

//user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    userId: {
        type: Int
    }
});


const Users = mongoose.model("User", UserSchema);

module.exports = Users;