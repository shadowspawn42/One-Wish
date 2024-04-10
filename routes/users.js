const { log } = require('console');
var express = require('express');
var { check } = require('express-validator');
var User = require('../models/user');
var Wishlist = require('../models/wishlist');
var authController = require('../controllers/auth');
var wishController = require('../controllers/wishlist');
var isAuth = require('../middleware/is.auth');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Sign Up', errorMessage: null});
});

router.get('/signup', function(req, res, next) {
  var message = null;
  res.render('signup', { title: 'Sign Up', errorMessage: message});
});

router.post('/addUser', 
  [
    check('username')
    .custom((value, {req}) => {
      return User.findOne({username: value})
      .then(userDoc => {
        if (userDoc) {
            return Promise.reject("Username exists already, please pick a different one.");
        }
      });
    }),
    check('password', 'Please enter a password with letters and numbers and is at least 5 character long.')
    .isLength({min: 5})
    .isAlphanumeric()
  ], 
  authController.postSignup);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);


// router.post('/addWishList', function(req, res, next) {
//   console.log(req.body.wishListName);
//   res.render('itemlists', { title: 'Items' });
// });

router.post('/addWishList', isAuth,
  [
    check('wishlistname', 'Please enter a wishlist name longer then 3 characters')
      .isLength({min: 3})
      .trim()
  ],
  wishController.postAddWishlist);

router.post('/deleteWishlist', isAuth, wishController.postDeleteWishlist);

router.get('/wishlist/:wishlistId', isAuth, wishController.getWishlist);

router.post('/addItem', isAuth, wishController.postAddItem);

router.post('/deleteItem', isAuth, wishController.postDeleteItem);

router.get('/user', isAuth, function(req, res, next) {
  Wishlist.find({userId: req.session.user._id})
        .then(wishlists => {
            // console.log(wishlists);
            return res.render('wishlists', {title: 'wishlists', wishlists: wishlists});
            })
});

module.exports = router;
