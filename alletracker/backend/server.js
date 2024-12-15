const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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
  try {
    const phrase = req.params.parameter;
    const offers = await getOffers(0, 2, phrase);

    const uniqueNamesArray = getUniqueCategories(offers);

    res.json({ message: "Example extracted categories: " + [uniqueNamesArray] });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
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
      res.json(result);
  } catch (error) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
