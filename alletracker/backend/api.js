const mongoose = require('mongoose');
const axios = require('axios');
const PriceSearch = require('./Models/PriceSearch');
const ProductSearch = require('./Models/ProductSearch');
const { getAccessToken } = require('./auth');

const API_BASE_URL = 'https://api.allegro.pl.allegrosandbox.pl';

async function searchAndCalculatePrices(phrase) {
  const accessToken = await getAccessToken();

  try {
      const response = await axios.get(`${API_BASE_URL}/offers/listing`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.allegro.public.v1+json',
          },
          params: { phrase },
      });

      const data = response.data;
      const prices = [];
      let imageUrl = null; // Representative image URL
      let offerId = null; // Example offer ID

      // Handle "promoted" prices
      if (data.items.promoted && data.items.promoted.length > 0) {
          data.items.promoted.forEach((item) => {
              const price = parseFloat(item.sellingMode.price.amount);
              prices.push(price);

              // Save representative image URL and offer ID
              if (!imageUrl) imageUrl = item.images[0]?.url || null;
              if (!offerId) offerId = item.id;
          });
      }

      // Handle "regular" prices
      if (data.items.regular && data.items.regular.length > 0) {
          data.items.regular.forEach((item) => {
              const price = parseFloat(item.sellingMode.price.amount);
              prices.push(price);

              // Save representative image URL and offer ID
              if (!imageUrl) imageUrl = item.images[0]?.url || null;
              if (!offerId) offerId = item.id;
          });
      }

      if (prices.length > 0) {
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

          console.log(`[DEBUG] Max Price: ${maxPrice}, Min Price: ${minPrice}, Avg Price: ${avgPrice}`);
          return { maxPrice, minPrice, avgPrice, itemCount: prices.length, phrase, imageUrl, offerId };
      } else {
          console.log('[DEBUG] No prices found.');
          return { maxPrice: 0, minPrice: 0, avgPrice: 0, itemCount: 0, phrase, imageUrl: null, offerId: null };
      }
  } catch (error) {
      console.error('[ERROR] API Request Error:', error.response ? error.response.data : error.message);
      throw error;
  }
}

async function getOffers(offset, limit, phrase) {
  try {
    const response = await axios.get(`${API_BASE_URL}/sale/products`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
        Accept: 'application/vnd.allegro.public.v1+json',
      },
      params: { offset, limit, phrase },
    });
    return response.data;
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.error || 'Unknown error';
    console.error(`API Request Error: ${message}`);
    throw { status: statusCode, message };
  }
}

const fetchProductData = async () => {
    try {
      const response = await axios.get(`/api/simpleasker/${route.params.id}`);
      productName.value = response.data.phrase; // Name or phrase
      productData.value = response.data.prices; // Prices for graph rendering
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

module.exports = { searchAndCalculatePrices, getOffers, fetchProductData };