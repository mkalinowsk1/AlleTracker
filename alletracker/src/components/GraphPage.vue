<template>
<div class="graph-page">
	<h2>{{ phrase }} Statistics</h2>
	<div v-if="avgPrices.length && searchDates.length">
		<div class="graph-container">
			<h3>Average Prices Over Time</h3>
			<canvas id="price-graph"></canvas>
		</div>
	</div>
	<div v-else>
		<p>Loading data or no data available for the selected phrase...</p>
	</div>
</div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
	name: 'GraphPage',
	setup() {
		const route = useRoute(); // To get the product ID from the URL
		const phrase = ref(route.params.phrase); // The phrase to query prices
		const avgPrices = ref([]); // Array to store average prices
		const searchDates = ref([]); // Array to store search dates

		onMounted(async () => {
			try {
				// Fetch price data for the given phrase
				const response = await axios.get(`/api/prices/${phrase.value}`);
				avgPrices.value = response.data.avgPrices;
				searchDates.value = response.data.searchDates;

				// Create the graph
				const ctx = document.getElementById('price-graph').getContext('2d');
				new Chart(ctx, {
					type: 'line',
					data: {
						labels: searchDates.value, // Dates on the X-axis
						datasets: [
							{
								label: `Average Prices for "${phrase.value}"`,
								data: avgPrices.value, // Prices on the Y-axis
								borderColor: 'rgba(75, 192, 192, 1)',
								backgroundColor: 'rgba(75, 192, 192, 0.2)',
								borderWidth: 2,
								fill: true,
								tension: 0.3,
							},
						],
					},
					options: {
						responsive: true,
						plugins: {
							legend: { display: true },
						},
						scales: {
							x: {
								title: {
									display: true,
									text: 'Dates',
								},
							},
							y: {
								title: {
									display: true,
									text: 'Average Price',
								},
							},
						},
					},
				});
			} catch (error) {
				console.error('Error fetching price data:', error);
			}
		});

		return { phrase, avgPrices, searchDates };
	},
};
</script>

<style>
.graph-page {
	padding: 20px;
}

.graph-container {
	margin-top: 20px;
}
</style>
