var Wishlist = require('../models/wishlist');
var Items = require('../models/items');
var { validationResult } = require('express-validator');

exports.postAddWishlist = function(req, res, next){
    var wishlistName = req.body.wishListName;
    var userId = req.session.user._id;
    
    console.log(wishlistName);

    var wishlist = new Wishlist({
        wishlistName: wishlistName,
        userId: userId,
        items: []
    });
    wishlist.save();

    req.user.addWishList(wishlist);
    Wishlist.find({userId: req.session.user._id})
        .then(wishlists => {
            // console.log(wishlists);
            return res.render('wishlists', {title: 'wishlists', wishlists: wishlists});
            });
    

    
};

exports.postDeleteWishlist = function(req, res, next){
    // console.log(req.body.wishlistId);

    Wishlist.findByIdAndDelete(req.body.wishlistId)
        .then(() => {
            console.log('Wishlist deleted');
            req.user.deleteWishList(req.body.wishlistId);
        })
        .then(() => {
            Items.find({wishlistId: req.body.wishlistId})
                .then(items => {
                    for (let item of items){
                        // console.log(item);
                        Items.findByIdAndDelete(item._id)
                            .then(() => {
                                console.log('Item was deleted')
                            })
                    }
                });
        })
        .then(() => {
            Wishlist.find({userId: req.session.user._id})
                .then(wishlists => {
                // console.log(wishlists);
                return res.render('wishlists', {title: 'wishlists', wishlists: wishlists});
            });
        });

};

exports.getWishlist = function(req, res, next){
    var wishId = req.params.wishlistId;
    // console.log(wishId);
    Wishlist.find({_id: wishId})
        .then(wishlist => {
            var wishName = wishlist[0].wishlistName;
            Items.find({wishlistId: wishId})
                .then(items => {
                    res.render('itemlists', {title: wishName, items: items, wishlistId: wishId});
                });
        });
    
};

exports.postAddItem = function(req, res, next){
    var wishlistId = req.body.wishlistId;

    var itemName = req.body.itemName;
    var itemPrice = req.body.itemPrice;
    var itemURL = req.body.itemURL;

    var item = new Items({
        itemName: itemName,
        itemPrice: itemPrice,
        itemURL: itemURL,
        itemBought: false,
        wishlistId: wishlistId
    });
    item.save();
    // console.log(item);

    Wishlist.findById(wishlistId)
        .then(wishlist => {
            var updatedItems = wishlist.items;
            updatedItems.push(item._id);
            Wishlist.findByIdAndUpdate(wishlistId, {items: updatedItems}, {new: true})
                .then(wishlist => {
                    // console.log(wishlist);
                });
        });

    Wishlist.find({_id: wishlistId})
        .then(wishlist => {
            var wishName = wishlist[0].wishlistName;
            Items.find({wishlistId: wishlistId})
                .then(items => {
                    res.render('itemlists', {title: wishName, items: items, wishlistId: wishlistId});
                });
        });
};

exports.postDeleteItem = function(req, res, next){
    Items.findByIdAndDelete(req.body.itemId)
        .then(() => {
            console.log('Item Deleted');
            Wishlist.findById(req.body.wishlistId)
                .then(wishlist => {
                    var updatedItems = wishlist.items.filter(list => {
                        return list._id.toString() !== req.body.itemId.toString();
                    });
                    Wishlist.findByIdAndUpdate(req.body.wishlistId, {items: updatedItems}, {new: true})
                        .then(wishlist => {
                            // console.log(wishlist);
                        });
                })
        });
    Wishlist.find({_id: req.body.wishlistId})
        .then(wishlist => {
            var wishName = wishlist[0].wishlistName;
            Items.find({wishlistId: req.body.wishlistId})
                .then(items => {
                    res.render('itemlists', {title: wishName, items: items, wishlistId: req.body.wishlistId});
                });
        });
};

exports.getBuyersView = function(req, res, next){
    var wishId = req.params.wishlistId;
    Wishlist.findById(wishId)
        .then(wishlist => {
            if(req.user){
                if(req.user._id.toString() === wishlist.userId.toString()){
                    return res.render('index', { title: 'Login', errorMessage: "You can't look at what they have bought you!", loginCreated: false});
                } else {
                    Items.find({wishlistId: wishId})
                        .then(items => {
                            res.render('buyersview', {title: "Buyer's View", items: items, wishlistId: wishId})
                        })
                }
            } else {
                Items.find({wishlistId: wishId})
                        .then(items => {
                            res.render('buyersview', {title: "Buyer's View", items: items, wishlistId: wishId})
                        })
            }
            
        })
};

exports.postItemBought = function(req, res, next){
    var itemId = req.body.itemId;
    Items.findById(itemId)
        .then(item => {
            var updatedItem = !item.itemBought;
            Items.findByIdAndUpdate(itemId, {itemBought: updatedItem})
                .then((item) => {
                    Items.find({wishlistId: req.body.wishlistId})
                        .then(items => {
                            res.render('buyersview', {title: "Buyer's View", items: items, wishlistId: req.body.wishlistId})
                        })
                })
        })
    
};