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
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #0d1b2a;
  color: #fff;
  text-align: center;
}
</style>
