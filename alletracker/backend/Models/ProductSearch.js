const mongoose = require('mongoose');

// Define the schema for product search
const ProductSearchSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    lastSearched: { type: Date, required: true }
}, {
    versionKey: false // Disable the "__v" field
});

module.exports = mongoose.model('ProductSearch', ProductSearchSchema);
