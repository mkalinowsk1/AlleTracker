<template>
    <div class="search-bar">
      <input v-model="searchTerm" type="text" placeholder="Search for product" />
      <button @click="searchProduct">
        <span>&#10140;</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchTerm: ''
      };
    },
    methods: {
      searchProduct() {
        console.log('Searching for product:', this.searchTerm);
        // Add logic here to fetch product data based on searchTerm
      }
    }
  };
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 150px;
  }
  
  .search-bar input {
    padding: 10px;
    font-size: 18px;
    border-radius: 25px;
    width: 400px;
    border: none;
    outline: none;
  }
  
  .search-bar button {
    background-color: red;
    border: none;
    padding: 10px 20px;
    color: white;
    border-radius: 25px;
    cursor: pointer;
  }
  
  .search-bar button:hover {
    background-color: #e60000;
  }
  </style>
  