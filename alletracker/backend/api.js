const axios = require('axios');
const { getAccessToken } = require('./auth');

const API_BASE_URL = 'https://api.allegro.pl.allegrosandbox.pl';

async function searchAndCalculatePrices(phrase) {
    // Get the access token (assuming getAccessToken() handles this)
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

        //Downloading "promoted" prices
        if (data.items.promoted) {
            data.items.promoted.forEach(item => {
                const price = parseFloat(item.sellingMode.price.amount);
                prices.push(price);
            });
        }

        //Downloading "regular" prices
        if (data.items.regular) {
            data.items.regular.forEach(item => {
                const price = parseFloat(item.sellingMode.price.amount);
                prices.push(price);
            });
        }

        // Calculating values
        if (prices.length > 0) {
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

            console.log(`Max price: ${maxPrice}, Min price: ${minPrice}, Avg price: ${avgPrice}`);
            return { maxPrice, minPrice, avgPrice, phrase};
        } else {
            console.log(`Max price: 0, Min price: 0, Avg price: 0`);
            return { maxPrice: 0, minPrice: 0, avgPrice: 0, phrase};
        }
    } catch (error) {
        console.error('API Request Error:', error.response ? error.response.data : error.message);
        throw error;
    }
}

module.exports = { searchAndCalculatePrices };