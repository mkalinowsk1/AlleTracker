import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/SearchBar.vue';
import GraphPage from '../components/GraphPage.vue';
import ProductDetails from '../components/ProductDetails.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/graph/:phrase', name: 'Graph', component: GraphPage, props: true },
  { path: '/product/:id', name: 'Product', component: ProductDetails},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;