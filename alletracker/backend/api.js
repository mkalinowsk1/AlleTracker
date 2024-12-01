const axios = require('axios');
const { getAccessToken } = require('./auth');

const API_BASE_URL = 'https://api.allegro.pl.allegrosandbox.pl';

  async function searchOffers(phrase) {
	// Get the access token (assuming getAccessToken() handles this)
	const accessToken = await getAccessToken();
  
	try {
		console.log(phrase)
	  const response = await axios.get(`${API_BASE_URL}/offers/listing`, {
		headers: {
		  Authorization: `Bearer ${accessToken}`,
		  Accept: 'application/vnd.allegro.public.v1+json',
		},
		params: {
		  phrase,
		},
	  });
	  return response.data;
	} catch (error) {
	  // Handle and throw the error if the request fails
	  console.error('API Request Error:', error.response ? error.response.data : error.message);
	  throw error;
	}
  }
  
module.exports = { searchOffers};