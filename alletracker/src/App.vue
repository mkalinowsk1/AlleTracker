<template>
  <div id="app">
    <Header />
    <SearchBar />
    <Footer />
  </div>
</template>

<script>
import Header from './components/AppHeader.vue';
import SearchBar from './components/SearchBar.vue';
import Footer from './components/AppFooter.vue';

export default {
  components: {
    Header,
    SearchBar,
    Footer
  }
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

@media (max-width: 600px) {
  .search-bar input {
    width: 90%;
  }
  .search-bar button {
    padding: 10px;
  }
}
