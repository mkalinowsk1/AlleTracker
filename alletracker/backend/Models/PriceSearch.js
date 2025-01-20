const mongoose = require('mongoose');

const PriceSearchSchema = new mongoose.Schema({
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
        required: false,  // Zmienione z true na false
        default: null
    },
    maxOfferId: {
        type: String,
        required: false,  // Zmienione z true na false
        default: null
    },
    minImageUrl: {
        type: String,
        required: false,  // Zmienione z true na false
        default: null
    },
    minOfferId: {
        type: String,
        required: false,  // Zmienione z true na false
        default: null
    },
    avgImageUrl: {
        type: String,
        required: false,  // Zmienione z true na false
        default: null
    },
    avgOfferId: {
        type: String,
        required: false,  // Zmienione z true na false
        default: null
    },
}, {
    versionKey: false
});

module.exports = mongoose.model('PriceSearch', PriceSearchSchema);