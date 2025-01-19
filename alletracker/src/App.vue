<template>
  <div id="app">
    <Header />
    <router-view />
    <Footer />
  </div>
</template>

<script>
import Header from './components/AppHeader.vue';
import Footer from './components/AppFooter.vue';
import '@fortawesome/fontawesome-free/css/all.css';


export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style>
/* Global styles */
body {
  margin: 20;
  font-family: Arial, sans-serif;
  width: 100%;
  background: linear-gradient(to bottom right, #e4f1fc, #c3e3fa);
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Softer shadow */
}
</style>