'use strict';
var express = require('express');
var router = express.Router();
var passport = require('passport');
var userModel = require('../models/user');
//var itemModel = require('../models/items');
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var path = require('path');

/* GET home page. */
router.get('/', function (req, res) {
     try{
        //Retrieve all articles if there is any 
        userModel.find({}, function (err, foundUsers) {
            console.log(err);
            console.log(foundUsers);
            //Pass found articles from server to pug file
            res.render('index', { users: foundUsers });
        });
    } 
    catch (err) {
        console.log(err);
        res.render('index', { title: 'Express' });
        }
});

/*POST for login*/
//Try to login with passport
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/*Logout*/
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

/*POST for register*/
router.post('/register', function (req, res) {
    //Insert user
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        var registerUser = {
            username: req.body.username,
            password: hash
        }
        //Check if user already exists
        userModel.find({ username: registerUser.username }, function (err, user) {
            if (err)
                console.log(err);
            if (user.length)
                return res.redirect('/login');
            const newUser = new userModel(registerUser);
            newUser.save(function (err) {
                console.log('Inserting');
                if (err) console.log(err);
                    req.login(newUser, function (err) {
                    console.log('Trying to login');
                if (err) console.log(err);
                    return res.redirect('/');
                });
            });
        });
    })
});

/*GET for register*/
router.get('/register', function (req, res) {
    res.render('register');
});


/*GET for login*/
router.get('/login', function (req, res) {
    res.render('login');
});

/* GET insert page. */
router.get('/insert', function (req, res) {
    res.render('insert');
});

/* POST insert page */
router.post('/insert', function (req, res) {
    var form = new formidable.IncomingForm();
    //Specify our image file directory
    form.uploadDir = path.join(__dirname, '../public/images');
    form.parse(req, function (err, fields, files) {
        console.log('Parsed form.');
        //Update filename
        files.image.name = fields.name + '.' + files.image.name.split('.')[1];
        //Create a new article using the Articles Model Schema
        const items = new userModel({ name: fields.name, description: fields.description, image: files.image.name });
        //Insert article into DB
        items.save(function (err) {
            console.log(err);
        });
        //Upload file on our server
        fs.rename(files.image.path, path.join(form.uploadDir, files.image.name), function (err) {
            if (err) console.log(err);
        });
        console.log('Received upload');
    });
    form.on('error', function (err) {
        console.log(err);
    });
    form.on('end', function (err, fields, files) {
        console.log('File successfuly uploaded');
        res.send({ "success": "Post has been uploaded! Please be careful of sketchy ads!" });
    });
});

/* GET update page */
router.get('/update/:id', function (req, res) {
    userModel.findById(req.params.id, function (err, foundItem) {
        if (err) console.log(err);
        //Render update page with specific article
        res.render('update', { users: foundItem })
    })
});

/* POST update page */
router.post('/update', function (req, res) {
    console.log(req.body);
    //Find and update by id
    userModel.findByIdAndUpdate(req.body.id, { name: req.body.name, description: req.body.description }, function (err, model) {
        console.log(err);
        res.redirect('/');
    });
});

/* POST delete page */
router.post('/delete/:id', function (req, res) {
    //Find and delete article
    userModel.findByIdAndDelete(req.params.id, function (err, model) {
        res.send({ "success": "Article Successfully Deleted!" })
    });
}); 

//Get Items page: this will display all of the items added for sale.
router.get('/items', function (req, res) {
    res.render('items');
});

module.exports = router;  