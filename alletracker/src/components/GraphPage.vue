<template>
<div class="graph-page">
	<div v-if="loading" class="loading-state">
	Loading product details...
	</div>
	<div v-else-if="error" class="error-state">
	{{ error }}
	</div>
	<h2>{{ product.phrase }} Statistics</h2>
	<div class="graph-container">
	<h3>{{ product.phrase }} Average Prices (2024)</h3>
	<canvas id="product-graph"></canvas>
	</div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
name: 'GraphPage',
setup() {
	const route = useRoute();
	const product = ref({});
	const loading = ref(true);
	const error = ref(null);
	
	const fetchProductDetails = async () => {
	try {
		loading.value = true;
		error.value = null;
		const response = await axios.get(`/api/product/${route.params.phrase}`);
		product.value = response.data;
	} catch (err) {
		error.value = 'Failed to load product details. Please try again later.';
		console.error('Error fetching product details:', err);
	} finally {
		loading.value = false;
	}
	};
	onMounted(async () => {
		await fetchProductDetails();
		const response = await axios.get(`http://localhost:3000/api/prices/${route.params.phrase}`);
		const { avgPrices, searchDates } = response.data;
	// Fake data for testing
	//const searchDates = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	//const avgPrices = [100, 110, 105, 120, 130, 125, 135, 140, 138, 145, 150, 155];

	// Render the graph
	const ctx = document.getElementById('product-graph').getContext('2d');
	new Chart(ctx, {
		type: 'line',
		data: {
		labels: searchDates,
		datasets: [
			{
			label: 'Average Price',
			data: avgPrices,
			borderColor: 'rgba(75, 192, 192, 1)',
			borderWidth: 2,
			fill: false,
			tension: 0.3, // Smooth curve
			},
		],
		},
		options: {
		responsive: true,
		plugins: {
			legend: { display: true },
		},
		scales: {
			x: { title: { display: true, text: 'Day' } },
			y: { title: { display: true, text: 'Price' } },
		},
		},
	});
	});
	return {
	product,
	loading,
	error,
	};
},
};
</script>

<style>
.graph-page {
padding: 20px;
text-align: center;
}
.graph-container {
margin: 20px auto;
max-width: 800px;
}
canvas {
background: #1b2b3a;
border-radius: 10px;
padding: 10px;
}
</style>