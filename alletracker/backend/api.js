const mongoose = require('mongoose');
const axios = require('axios');
const Item = require('./Models/Item');
const { getAccessToken } = require('./auth');

const API_BASE_URL = 'https://api.allegro.pl.allegrosandbox.pl';

async function searchAndCalculatePrices(phrase) {
  // Get the access token
  const accessToken = await getAccessToken();

  try {
      console.log(phrase);
      const response = await axios.get(`${API_BASE_URL}/offers/listing`, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/vnd.allegro.public.v1+json',
          },
          params: {
              phrase,
          },
      });

      console.log('Access Token:', accessToken);
      console.log('Response:', response.data);

      const data = response.data;
      const prices = [];
      let firstItem = null;

      // Downloading "promoted" prices and first item
      if (data.items.promoted && data.items.promoted.length > 0) {
          data.items.promoted.forEach(item => {
          const price = parseFloat(item.sellingMode.price.amount);
          prices.push(price);
          });

          // Extract first item's id and first image
          const firstPromotedItem = data.items.promoted[0];
          firstItem = {
          id: firstPromotedItem.id,
          image: firstPromotedItem.images.length > 0 ? firstPromotedItem.images[0].url : null,
          };
      }

      // Downloading "regular" prices (if no "promoted" items found)
      if (!firstItem && data.items.regular && data.items.regular.length > 0) {
          data.items.regular.forEach(item => {
              const price = parseFloat(item.sellingMode.price.amount);
              prices.push(price);
          });

          // Extract first item's id and images
          const firstRegularItem = data.items.regular[0];
          firstItem = {
              id: firstRegularItem.id,
              images: firstRegularItem.images.map(img => img.url),
          };
      }

      // Calculating values
      let maxPrice = 0, minPrice = 0, avgPrice = 0, itemCount = 0;
      if (prices.length > 0) {
          maxPrice = Math.max(...prices);
          minPrice = Math.min(...prices);
          avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
          itemCount = prices.length;
          console.log(`Max price: ${maxPrice}, Min price: ${minPrice}, Avg price: ${avgPrice}`);
      }

      // Save search results to MongoDB
      const searchResult = new Item({
          phrase,
          maxPrice,
          minPrice,
          avgPrice,
          itemCount,
          offerId: firstItem ? firstItem.id : null, // Include first item's id
          imageUrl: firstItem ? firstItem.image : null // Include first item's images
      });

      await searchResult.save();
      console.log('Search result saved to database');

      return { 
          maxPrice, 
          minPrice, 
          avgPrice, 
          phrase, 
          offerId: firstItem ? firstItem.id : null, // Include first item's id
          imageUrl: firstItem ? firstItem.image : null // Include first item's images
      };
  } catch (error) {
      console.error('API Request Error:', error.response ? error.response.data : error.message);
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