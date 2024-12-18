<template>
<div class="product-details-container">
	<div v-if="loading" class="loading-state">
	Loading product details...
	</div>
	
	<div v-else-if="error" class="error-state">
	{{ error }}
	</div>
	
	<div v-else class="product-card">
	<div class="product-header">
		<h1 class="product-title">{{ product.phrase }}</h1>
	</div>
	
	<div class="product-content">
		<!-- <div class="product-image-container">
	<a :href="generateOfferLink(product.avgOfferId)" target="_blank" rel="noopener noreferrer">
		<img 
		:src="product.avgImageUrl || '/placeholder.jpg'" 
		:alt="product.phrase || 'Product image'" 
		class="product-image" 
		@error="handleImageError"
		/>
	</a>
</div> -->
		
		<div class="price-stats">
		<div class="price-card min">
			<a :href="generateOfferLink(product.minOfferId)" target="_blank" rel="noopener noreferrer">
			<div class="price-label">Minimum Price</div>
			<img 
		:src="product.minImageUrl || '/placeholder.jpg'" 
		:alt="product.phrase || 'Product image'" 
		class="product-image" 
		@error="handleImageError"
		/>
			<div class="price-value">{{ formatPrice(product.minPrice) }} zł</div>
		</a>
		</div>
		
		<div class="price-card avg">
			<a :href="generateOfferLink(product.avgOfferId)" target="_blank" rel="noopener noreferrer">
			<div class="price-label">Average Price</div>
			<img 
		:src="product.avgImageUrl || '/placeholder.jpg'" 
		:alt="product.phrase || 'Product image'" 
		class="product-image" 
		@error="handleImageError"
		/>
			<div class="price-value">{{ formatPrice(product.avgPrice) }} zł
			</div>
		</a>
		</div>
		
		<div class="price-card max">
			<a :href="generateOfferLink(product.maxOfferId)" target="_blank" rel="noopener noreferrer">
			<div class="price-label">Maximum Price</div>
			<img 
		:src="product.maxImageUrl || '/placeholder.jpg'" 
		:alt="product.phrase || 'Product image'" 
		class="product-image" 
		@error="handleImageError"
		/>
			<div class="price-value">{{ formatPrice(product.maxPrice) }} zł</div>
		</a>
		</div>
		</div>

		<div class="item-count">
		Based on {{ product.itemCount || 0 }} items
		</div>
	</div>
	</div>
</div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

export default {
name: 'ProductDetails',

setup() {
	const route = useRoute();
	const product = ref({});
	const loading = ref(true);
	const error = ref(null);
	
	const fetchProductDetails = async () => {
	try {
		loading.value = true;
		error.value = null;
		const response = await axios.get(`/api/product/${route.params.id}`);
		product.value = response.data;
	} catch (err) {
		error.value = 'Failed to load product details. Please try again later.';
		console.error('Error fetching product details:', err);
	} finally {
		loading.value = false;
	}
	};

	const handleImageError = (e) => {
    if (!e.target.src.endsWith('placeholder.jpg')) {
        e.target.src = '/placeholder.jpg';
    }
};

	const formatPrice = (price) => {
	return Number(price).toFixed(2);
	};

	const generateOfferLink = (offerId) => {
    return `https://allegro.pl.allegrosandbox.pl/oferta/${offerId}`;
    };

	onMounted(() => {
	fetchProductDetails();
	});

	return {
	product,
	loading,
	error,
	handleImageError,
	formatPrice,
	generateOfferLink
	};
}
};
</script>

<style scoped>
.product-details-container {
max-width: 1200px;
margin: 2rem auto;
padding: 0 1rem;
}

.product-card {
background: white;
border-radius: 12px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
overflow: hidden;
}

.product-header {
background: #f8f9fa;
padding: 1.5rem;
border-bottom: 1px solid #e9ecef;
}

.product-title {
font-size: 1.75rem;
color: #333;
margin: 0;
font-weight: 600;
}

.product-content {
padding: 2rem;
}

.product-image-container {
width: 100%;
max-width: 400px;
margin: 0 auto 2rem;
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-image {
width: 100%;
height: auto;
object-fit: cover;
display: block;
}

.price-stats {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
gap: 1.5rem;
margin-bottom: 1.5rem;
}

.price-card {
background: white;
border-radius: 8px;
padding: 1.5rem;
text-align: center;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
transition: transform 0.2s ease;
}

.price-card:hover {
transform: translateY(-2px);
}

.price-card.min {
border-top: 4px solid #28a745;
}

.price-card.avg {
border-top: 4px solid #007bff;
}

.price-card.max {
border-top: 4px solid #dc3545;
}

.price-label {
font-size: 0.875rem;
color: #6c757d;
margin-bottom: 0.5rem;
text-transform: uppercase;
letter-spacing: 0.5px;
}

.price-value {
font-size: 1.5rem;
font-weight: 600;
color: #333;
}

.item-count {
text-align: center;
color: #6c757d;
font-size: 0.875rem;
margin-top: 1rem;
}

.loading-state {
text-align: center;
padding: 2rem;
color: #6c757d;
font-size: 1.125rem;
}

.error-state {
text-align: center;
padding: 2rem;
color: #dc3545;
font-size: 1.125rem;
background: #fff;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
.price-stats {
	grid-template-columns: 1fr;
}

.product-title {
	font-size: 1.5rem;
}

.product-content {
	padding: 1rem;
}
}
</style>