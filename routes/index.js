var express = require('express');
var wishController = require('../controllers/wishlist');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'One Wish', errorMessage: null, loginCreated: false});
});

router.get('/wishlist/:wishlistId', wishController.getBuyersView);

router.post('/wishlist/itemBought', wishController.postItemBought);


module.exports = router;
