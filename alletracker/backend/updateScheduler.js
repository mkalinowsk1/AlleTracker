const cron = require('node-cron');
const ProductSearch = require('./Models/ProductSearch');
const { searchAndCalculatePrices } = require('./api');
const PriceSearch = require('./Models/PriceSearch');

// Function to check and update product prices
async function updateProductPrices() {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Find all products that haven't been updated in the last week
        const productsToUpdate = await ProductSearch.find({
            lastSearched: { $lt: oneWeekAgo }
        });

        console.log(`[SCHEDULER] Found ${productsToUpdate.length} products to update`);

        // Update each product's prices
        for (const product of productsToUpdate) {
            try {
                console.log(`[SCHEDULER] Updating prices for: ${product.name}`);
                
                // Get new price data
                const result = await searchAndCalculatePrices(product.name);

                // Save new price data
                const newSearch = new PriceSearch(result);
                await newSearch.save();

                // Update lastSearched timestamp
                product.lastSearched = new Date();
                await product.save();

                console.log(`[SCHEDULER] Successfully updated prices for: ${product.name}`);
                
                // Add delay between requests to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 2000));
                
            } catch (error) {
                console.error(`[SCHEDULER] Error updating product ${product.name}:`, error);
                continue; // Continue with next product even if one fails
            }
        }

        console.log('[SCHEDULER] Completed price update cycle');
    } catch (error) {
        console.error('[SCHEDULER] Error in update cycle:', error);
    }
}

// Initialize the scheduler
function initializeScheduler() {
    // Run every day at 3 AM (when traffic is likely to be low)
    // Format: minute hour day month day-of-week
    cron.schedule('04 11 * * *', async () => {
        console.log('[SCHEDULER] Starting scheduled price update');
        await updateProductPrices();
    });

    console.log('[SCHEDULER] Price update scheduler initialized');
}

module.exports = { initializeScheduler, updateProductPrices };