const { ClientCredentials } = require('simple-oauth2');
require('dotenv').config();

const config = {
	client: {
		id: '79f67d44cb14459dad7cef11bc4f51a0',
		secret: 'uaOXxwMbPwGzh1nMxPF2wgr5Msa1x0DEPAomv9975lZaEgzz3YUw0R2KccE2IUsr',
	},
	auth: {
		tokenHost: 'https://allegro.pl.allegrosandbox.pl',
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

module.exports = { getAccessToken };