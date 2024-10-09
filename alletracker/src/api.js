const axios = require('axios');
const { getAccessToken } = require('./auth');

const API_BASE_URL = 'https://api.allegro.pl';

async function getOffers(offset, limit, phrase) {
	const accessToken = await getAccessToken();
	
	try {
		console.log(phrase)
	  const response = await axios.get(`${API_BASE_URL}/sale/products`, {
		headers: {
		  Authorization: `Bearer ${accessToken}`,
		  Accept: 'application/vnd.allegro.public.v1+json',
		},
		params: {
		  offset,
		  limit,
		  phrase,
		},
	  });
	  return response.data;
	} catch (error) {
	  console.error('API Request Error:', error.response ? error.response.data : error.message);
	  throw error;
	}
  }
  
module.exports = { getOffers };
