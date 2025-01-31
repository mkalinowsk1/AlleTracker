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
    maxImageUrl: {
        type: String,
        required: true,
    },
    maxOfferId: {
        type: String,
        required: true,
    },
    minImageUrl: {
        type: String,
        required: true,
    },
    minOfferId: {
        type: String,
        required: true,
    },
    avgImageUrl: {
        type: String,
        required: true,
    },
    avgOfferId: {
        type: String,
        required: true,
    },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
