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
    imageUrl: {
        type: String, // Change to optional
    },
    offerId: {
        type: String, // Change to optional
    }
}, {
    versionKey: false // Disable the "__v" field
});

const PriceSearch = mongoose.model('PriceSearch', PriceSearchSchema);

module.exports = PriceSearch;
