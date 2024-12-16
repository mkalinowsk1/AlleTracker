<template>
<div class="graph-page">
	<h2>{{ product.phrase }} Statistics</h2>
	<div v-if="product">
	<div class="graph-container">
		<h3>Average Prices (Saved Data)</h3>
		<canvas id="product-graph"></canvas>
	</div>
	</div>
</div>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Chart from 'chart.js/auto'; // Import Chart.js

export default {
name: 'GraphPage',
setup() {
	const route = useRoute(); // To get the product ID from the URL
	const product = reactive({}); // Store product data

	onMounted(async () => {
	const productId = route.params.id;

	try {
		// Fetch product details from the database
		const response = await axios.get(`/api/product/${productId}`);
		Object.assign(product, response.data);

		// Example graph data using product prices
		const ctx = document.getElementById('product-graph').getContext('2d');
		new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['Price'], // Simple example
			datasets: [
			{
				label: product.phrase,
				data: [product.minPrice, product.avgPrice, product.maxPrice],
				borderColor: 'rgba(75, 192, 192, 1)',
				borderWidth: 2,
				fill: false,
				tension: 0.3,
			},
			],
		},
		options: {
			responsive: true,
			plugins: {
			legend: { display: true },
			},
		},
		});
	} catch (error) {
		console.error('Error fetching product details:', error);
	}
	});

	return { product };
},
};
</script>
