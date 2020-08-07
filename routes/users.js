'use strict';
var express = require('express');
var router = express.Router();
var userModel = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res) {
    /* GET users listing. */
    if (req.isAuthenticated()) {
        userModel.find({}, function (err, users) {
            res.render('users', { users: users, user: req.user });
        });
    } else {
        res.redirect('/login');
    }
}); 

module.exports = router;
