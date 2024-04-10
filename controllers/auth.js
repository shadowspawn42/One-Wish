var User = require('../models/user');
var Wishlist = require('../models/wishlist');
var bcrypt = require('bcryptjs')
var { validationResult } = require('express-validator');

exports.postSignup = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;
    var errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.render('signup', { title: 'Sign Up', errorMessage: errors.array()[0].msg});
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
           var user = new User({
                username: username,
                password: hashedPassword,
                wishlists: []
            }); 
            user.save();
        })
    res.render('index', { title: 'Login', errorMessage: null, loginCreated: true});
};

exports.postLogin = function(req, res, next){
    var username = req.body.username;
    var password = req.body.password;

    User.findOne({username: username})
        .then(user => {
            if(!user){
                console.log("No user found");
                res.render('index', { title: 'Login', errorMessage: 'Invalid Username or Password', loginCreated: false});
            }
            else{
                console.log("User found");
                bcrypt.compare(password, user.password)
                    .then(doMatch => {
                        if(doMatch){
                            console.log('Passwords match');
                            req.session.isLoggedIn = true;
                            req.session.user = user;

                            Wishlist.find({userId: user._id})
                            .then(wishlists => {
                                // console.log(wishlists);
                                return res.render('wishlists', {title: 'wishlists', wishlists: wishlists});
                            });
                            // return res.render('wishlists', { title: 'WishLists'});
                        }
                        else{
                            console.log("Password doesn't match");
                            res.render('index', { title: 'Login', errorMessage: 'Invalid Username or Password', loginCreated: false});
                        }
                    });
            }
        });
};

exports.postLogout = function(req, res, next){
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};