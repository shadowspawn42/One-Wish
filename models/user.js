var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userScheme = new Schema({
    password:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    wishlists:[{
        wishlistId: { type: Schema.Types.ObjectId, ref: 'Wishlist', required: true}
    }]
});

userScheme.methods.addWishList = function(wishlist){
    // console.log(wishlist);
    const updatedWishLists = this.wishlists;
    updatedWishLists.push({wishlistId: wishlist._id});
    // console.log(updatedWishLists);
    this.wishlists = updatedWishLists;
    return this.save();
};

userScheme.methods.deleteWishList = function(wishlistId){
    const updatedWishLists = this.wishlists.filter(list => {
        return list.wishlistId.toString() !== wishlistId.toString();
    });
    // console.log('Updated User list', updatedWishLists);
    this.wishlists = updatedWishLists;
    return this.save();
};

module.exports = mongoose.model('User', userScheme);