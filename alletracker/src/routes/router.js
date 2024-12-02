import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/SearchBar.vue';
import GraphPage from '../components/GraphPage.vue';

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/graph', name: 'Graph', component: GraphPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
