<template>
<div class="graph-page">
	<h2>Widget 3000 Statistics</h2>
	<div class="graph-container">
	<h3>Widget 3000 Average Prices (2024)</h3>
	<canvas id="product-graph"></canvas>
	</div>
</div>
</template>

<script>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto'; // Import Chart.js

export default {
name: 'GraphPage',
setup() {
	onMounted(() => {
	// Fake data for testing
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const prices = [100, 110, 105, 120, 130, 125, 135, 140, 138, 145, 150, 155];

	// Render the graph
	const ctx = document.getElementById('product-graph').getContext('2d');
	new Chart(ctx, {
		type: 'line',
		data: {
		labels: months,
		datasets: [
			{
			label: 'Average Price (in $)',
			data: prices,
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
			x: { title: { display: true, text: 'Months' } },
			y: { title: { display: true, text: 'Price (in $)' } },
		},
		},
	});
	});
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
