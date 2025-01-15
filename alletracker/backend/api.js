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
      const items = [];

      // Extract relevant data
      const processItems = (list) => {
          if (!list || !Array.isArray(list)) return;
          
          list.forEach((item) => {
              if (item && item.sellingMode && item.sellingMode.price) {
                  const price = parseFloat(item.sellingMode.price.amount);
                  if (!isNaN(price)) {
                      prices.push(price);
                      items.push({
                          price,
                          offerId: item.id || null,
                          imageUrl: item.images && item.images[0] ? item.images[0].url : null
                      });
                  }
              }
          });
      };

      if (data.items) {
          if (data.items.promoted && Array.isArray(data.items.promoted)) {
              processItems(data.items.promoted);
          }
          if (data.items.regular && Array.isArray(data.items.regular)) {
              processItems(data.items.regular);
          }
      }

      if (prices.length > 0) {
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

          const maxProduct = items.find(item => item.price === maxPrice) || {};
          const minProduct = items.find(item => item.price === minPrice) || {};
          const avgProduct = items.reduce((closest, item) => {
              return Math.abs(item.price - avgPrice) < Math.abs(closest.price - avgPrice) ? item : closest;
          }, items[0]) || {};

          return {
              maxPrice,
              minPrice,
              avgPrice,
              itemCount: prices.length,
              phrase,
              maxOfferId: maxProduct.offerId || null,
              maxImageUrl: maxProduct.imageUrl || null,
              minOfferId: minProduct.offerId || null,
              minImageUrl: minProduct.imageUrl || null,
              avgOfferId: avgProduct.offerId || null,
              avgImageUrl: avgProduct.imageUrl || null,
          };
      } else {
          // Jeśli nie znaleziono żadnych cen, zwróć podstawowe dane
          return {
              maxPrice: 0,
              minPrice: 0,
              avgPrice: 0,
              itemCount: 0,
              phrase,
              maxOfferId: null,
              maxImageUrl: null,
              minOfferId: null,
              minImageUrl: null,
              avgOfferId: null,
              avgImageUrl: null,
          };
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