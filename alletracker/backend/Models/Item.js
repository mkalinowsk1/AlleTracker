const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    phrase: {
        type: String,
        required: true,
        index: true,
    },
    maxPrice: {
        type: Number,
        required: true,
    },
    minPrice: {
        type: Number,
        required: true,
    },
    avgPrice: {
        type: Number,
        required: true,
    },
    itemCount: {
        type: Number,
        required: true,
    },
    searchDate: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    offerId: {
        type: String,
        required: true,
    },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
