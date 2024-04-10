var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var wishlistSchema = new Schema({
    wishlistName: {
        type: String,
        Required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    }]

});

wishlistSchema.methods.addItem = function(item){
    const updatedItems = this.items;
    updatedItems.push(item._id);
    // console.log(updatedItems);
    this.items = updatedItems;
    return this.save(); 
};

module.exports = mongoose.model('Wishlist', wishlistSchema);