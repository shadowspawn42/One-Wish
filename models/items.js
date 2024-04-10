var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    itemPrice: {
        type: Number,
        required: true
    },
    itemURL: {
        type: String,
        required: true
    },
    itemBought: {
        type: Boolean,
        required: true
    },
    wishlistId: {
        type: Schema.Types.ObjectId, 
        ref: 'Wishlist', 
        required: true
    }
});

module.exports = mongoose.model('Item', itemSchema);