const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Item = require('./Models/Item');
const { searchAndCalculatePrices, getOffers } = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse JSON requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/price_search', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

function getUniqueCategories(offers) {
  const uniqueNames = new Set();

  offers.products.forEach(offer => {
    offer.category.path.forEach(category => {
      uniqueNames.add(category.name);
    });
  });

  return [...uniqueNames];
}

// Sample GET endpoint
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

app.get('/api/categories/:parameter', async (req, res) => {
  const phrase = req.params.parameter;
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

  try {
    const offers = await getOffers(offset, limit, phrase);

    const filteredOffers = offers.products.filter(offer => {
      const price = parseFloat(offer.sellingMode.price.amount);
      return price >= minPrice && price <= maxPrice;
    });

    const uniqueNamesArray = getUniqueCategories(filteredOffers);

    res.json({
      categories: uniqueNamesArray,
      offers: filteredOffers.slice(offset, offset + limit),
      total: filteredOffers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Define a POST route with a URL parameter
app.get('/api/simpleasker/:parameter', async (req, res) => {
  // Extract the parameter from the URL
  const parameter = req.params.parameter;

  // Check if parameter is provided
  if (!parameter) {
      return res.status(400).json({ error: 'Missing parameter' });
  }

  try {
      const result = await searchAndCalculatePrices(parameter);

      const prices = await Item.find({ phrase: parameter }, 'maxPrice minPrice avgPrice');
      console.log(result, prices);
      res.json( ...result, prices);
  } catch (error) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/api/search/:term', async (req, res) => {
  const searchTerm = req.params.term;

  try {
      // Search for items in the database that match the search term
      const results = await Item.find({
          phrase: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
      }).limit(10); // Limit results to 10 for performance

      res.json(results);
  } catch (error) {
      console.error('Error searching database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
      const product = await Item.findById(productId);
      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
