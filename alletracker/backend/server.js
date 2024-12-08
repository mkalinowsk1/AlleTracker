const express = require('express');
const cors = require('cors');
const { searchAndCalculatePrices } = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse JSON requests

// Sample GET endpoint
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Express!' });
});

// Define a POST route with a URL parameter
app.get('/api/simpleasker/:parameter', (req, res) => {
    // Extract the parameter from the URL
    const parameter = req.params.parameter;
  
    // Check if parameter is provided
    if (!parameter) {
      return res.status(400).json({ error: 'Missing parameter' });
    }
    
    res.json(searchAndCalculatePrices(parameter));
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
