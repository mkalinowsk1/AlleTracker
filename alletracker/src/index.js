const { getOffers } = require('./api');

async function main() {
  try {
	let phrase = 'konsola xbox one'
    const offers = await getOffers(0,2,phrase);
    console.log('User Information:', offers);
  } catch (error) {
    console.error('Error fetching user information:', error.message);
  }
}

main();
