<template>
	<div class="graph-page">
	<h2>[Product name] Statistics</h2>
	<div class="graph-container">
		<h3>[Product name] Average Prices</h3>
		<canvas id="product-graph"></canvas>
	</div>
	</div>
</template>

<script>
import { onMounted } from 'vue';
import { Chart } from 'chart.js';

export default {
	name: 'GraphPage',
	setup() {
	onMounted(() => {
		// Example using Chart.js or any graph library
		const ctx = document.getElementById('product-graph').getContext('2d');
		new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			datasets: [
			{
				label: 'Average Price',
				data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 6, 4, 10],
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 2,
				fill: false,
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
