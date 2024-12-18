<template>
<div class="graph-page">
	<h2>{{ phrase }} Statistics</h2>
	<div v-if="!loading">
	<div v-if="chartData.labels.length" class="graph-container">
		<h3>Average Prices Over Time</h3>
		<canvas ref="chartCanvas"></canvas>
	</div>
	<div v-else class="error-message">
		No data available for the selected phrase.
	</div>
	</div>
	<div v-else class="loading-message">
	Loading data...
	</div>
</div>
</template>

<script>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
name: 'GraphPage',
setup() {
	const route = useRoute();
	const phrase = ref(route.params.phrase);
	const loading = ref(true);
	const chartInstance = ref(null);
	const chartCanvas = ref(null);
	const chartData = ref({
	labels: [],
	datasets: []
	});

	// Function to destroy existing chart
	const destroyChart = () => {
	if (chartInstance.value) {
		chartInstance.value.destroy();
		chartInstance.value = null;
	}
	};

	// Function to create new chart
	const createChart = () => {
	if (!chartCanvas.value || !chartData.value.labels.length) return;

	destroyChart();

	const ctx = chartCanvas.value.getContext('2d');
	chartInstance.value = new Chart(ctx, {
		type: 'line',
		data: {
		labels: chartData.value.labels,
		datasets: [{
			label: `Average Prices for "${phrase.value}"`,
			data: chartData.value.datasets,
			borderColor: 'rgba(75, 192, 192, 1)',
			backgroundColor: 'rgba(75, 192, 192, 0.2)',
			borderWidth: 2,
			fill: true,
			tension: 0.3
		}]
		},
		options: {
		responsive: true,
		maintainAspectRatio: true,
		plugins: {
			legend: { display: true }
		},
		scales: {
			x: {
			title: {
				display: true,
				text: 'Dates'
			}
			},
			y: {
			title: {
				display: true,
				text: 'Average Price'
			},
			beginAtZero: false
			}
		}
		}
	});
	};

	// Function to fetch and process data
	const fetchData = async () => {
	loading.value = true;
	try {
		const response = await axios.get(`/api/prices/${phrase.value}`);
		
		// Remove duplicate dates and their corresponding prices
		const uniqueDates = new Set();
		const cleanedData = response.data.searchDates.reduce((acc, date, index) => {
		if (!uniqueDates.has(date)) {
			uniqueDates.add(date);
			acc.dates.push(date);
			acc.prices.push(response.data.avgPrices[index]);
		}
		return acc;
		}, { dates: [], prices: [] });

		chartData.value = {
		labels: cleanedData.dates,
		datasets: cleanedData.prices
		};

		// Create chart after data is processed
		createChart();
	} catch (error) {
		console.error('Error fetching price data:', error);
		chartData.value = { labels: [], datasets: [] };
	} finally {
		loading.value = false;
	}
	};

	// Watch for route changes
	watch(() => route.params.phrase, (newPhrase) => {
	phrase.value = newPhrase;
	fetchData();
	});

	onMounted(() => {
	fetchData();
	});

	// Cleanup on component unmount
	onUnmounted(() => {
	destroyChart();
	});

	return { 
	phrase, 
	loading,
	chartData,
	chartCanvas 
	};
}
};
</script>

<style>
.graph-page {
padding: 20px;
max-width: 1200px;
margin: 0 auto;
}

.graph-container {
margin-top: 20px;
position: relative;
height: 400px;
}

.loading-message,
.error-message {
text-align: center;
padding: 20px;
color: #666;
}
</style>