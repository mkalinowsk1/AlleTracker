const { ClientCredentials } = require('simple-oauth2');
require('dotenv').config();

const config = {
	client: {
		id: process.env.CLIENT_ID,
		secret: process.env.CLIENT_SECRET,
	},
	auth: {
		tokenHost: 'https://allegro.pl',
		tokenPath: '/auth/oauth/token',
	},
};

const client = new ClientCredentials(config);

async function getAccessToken() {
	try{
		const tokenParams = {
			scope: 'allegro:api:sale:offers:read'
		};
		const accessToken = await client.getToken(tokenParams);
		return accessToken.token.access_token;
	}	catch (error) {
		console.error('Access Token Error', error.message);
		throw error;
	}
}

module.exports = { getAccessToken};