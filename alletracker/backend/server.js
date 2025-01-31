const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PriceSearch = require('./Models/PriceSearch');
const ProductSearch = require('./Models/ProductSearch');
const { searchAndCalculatePrices, getOffers } = require('./api');
const { initializeScheduler } = require('./updateScheduler');

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
  initializeScheduler();
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

app.get('/api/simpleasker/:parameter', async (req, res) => {
  const parameter = req.params.parameter;

  if (!parameter) {
      return res.status(400).json({ error: 'Missing parameter' });
  }

  try {
      // Check or create product entry
      let product = await ProductSearch.findOne({ name: parameter });

      if (!product) {
          product = new ProductSearch({ name: parameter, lastSearched: new Date() });
          await product.save();
          console.log('[DEBUG] New product entry created:', product);
      } else {
          const now = new Date();
          const timeDiff = now - product.lastSearched;

          // Only allow saving price data if 24 hours have passed since last search
         // if (timeDiff <= 24 * 60 * 60 * 1000) {
         //     console.log('[DEBUG] Last search was within 24 hours. Skipping save.');
         //     return res.json({ message: 'Search performed recently. No new data saved.' });
         // }

          // Update the last searched time
          product.lastSearched = now;
          await product.save();
          console.log('[DEBUG] Product entry updated with new lastSearched:', product);
      }

      // Perform search and calculate prices
      const result = await searchAndCalculatePrices(parameter);

      // Save price data to the database
      const newSearch = new PriceSearch(result);
      await newSearch.save();
      console.log('[DEBUG] New price data saved to database:', newSearch);

      // Retrieve historical prices for the item
      const prices = await PriceSearch.find({ phrase: parameter }, 'maxPrice minPrice avgPrice searchDate');

      console.log('[DEBUG] Historical Prices:', prices);

      // Respond with current and historical prices
      res.json({ currentPrices: result, historicalPrices: prices });
  } catch (error) {
      console.error('[ERROR] Error occurred:', error.message);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.get('/api/search/:term', async (req, res) => {
  const searchTerm = req.params.term;

  try {
      // Search for items in the database that match the search term
      const results = await ProductSearch.find({
          name: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
      }).limit(10); // Limit results to 10 for performance

      res.json(results);
  } catch (error) {
      console.error('Error searching database:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/product/:phrase', async (req, res) => {
  const phrase = req.params.phrase;

  try {
      const product = await PriceSearch.findOne({ phrase: phrase });
      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
  } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/prices/:phrase', async (req, res) => {
  const phrase = req.params.phrase;

  try {
      const { avgPrices, searchDates } = await getPricesAndDates(phrase);
      res.json({ avgPrices, searchDates });
  } catch (error) {
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

async function getPricesAndDates(phrase) {
  //console.log(phrase);
  try {
    // Wyszukaj wszystkie wpisy dla danego `phrase` i wybierz tylko `avgPrice` oraz `searchDate`
    const prices = await PriceSearch.find(
      { phrase: phrase },
      'avgPrice searchDate' // Wybierz tylko te pola
    ).sort({ searchDate: 1 }); // Opcjonalnie sortuj wyniki po dacie rosnąco

    if (!prices.length) {
      throw new Error('No prices found for the given phrase');
    }

    // Podziel wyniki na dwie tablice: ceny i daty (przekonwertowane na `day.month.year`)
    const avgPrices = prices.map(p => p.avgPrice);
    const searchDates = prices.map(p => {
      const date = new Date(p.searchDate);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    });
    console.log(searchDates);
    return { avgPrices, searchDates };
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw new Error('Internal Server Error');
  }
}



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
