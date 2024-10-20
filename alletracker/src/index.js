const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017', { 
}).then(() => {
	console.log('Connected to MongoDB...');
}).catch(err => {
	console.error('Could not connect to MongoDB...');
});

app.use(express.urlencoded({ extended: true }));

app.use(express.json())




const { getOffers } = require('./api');

async function main() {
  try {
	let phrase = 'konsola xbox one'
    const offers = await getOffers(0,2,phrase);
    console.log('User Information:', userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error.message);
  }
}
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`);
});
//main();
