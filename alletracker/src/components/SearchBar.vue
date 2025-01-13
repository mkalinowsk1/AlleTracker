<template>
  <div class="search-container">
    <div class="container"></div>
    <div class="search-bar">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search for product"
        class="search-input"
        @input="debouncedSearch()"
        @keyup.enter="handleEnter"
      />
      <button @click="searchProduct" class="search-button">
        <span>&#128269;</span> <!-- Search icon -->
      </button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="isLoading" class="loading">
      Searching...
    </div>

    <div v-if="products.length" class="results">
      <ul>
        <li
          v-for="product in products"
          :key="product.phrase"
          @click="goToGraph(product)"
        >
          {{ product.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

export default {
  name: 'SearchBar',
  setup() {
    const searchTerm = ref('');
    const products = ref([]);
    const isLoading = ref(false);
    const error = ref('');

    const debouncedSearchFn = debounce(async (term) => {
      if (!term || term.length < 2) {
        products.value = [];
        return;
      }

      try {
        isLoading.value = true;
        error.value = '';

        const response = await axios.get(`/api/search/${term}`, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data && response.data.length > 0) {
          products.value = response.data;
        } else {
          products.value = [];
          error.value = 'No products found';
        }
      } catch (err) {
        console.error('Error searching products:', err);
        error.value = 'Failed to fetch products. Please try again.';
        products.value = [];
      } finally {
        isLoading.value = false;
      }
    }, 500);

    const searchProduct = () => {
      debouncedSearchFn(searchTerm.value);
    };

    const handleEnter = async () => {
      if (products.value.length === 0 && searchTerm.value) {
        try {
          isLoading.value = true;
          error.value = '';

          const response = await axios.get(`/api/simpleasker/${searchTerm.value}`, {
            timeout: 5000,
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.data) {
            goToGraph(response.data);
          }
        } catch (err) {
          console.error('Error with simpleasker:', err);
          error.value = 'Unable to process your request. Please try again later.';
        } finally {
          isLoading.value = false;
        }
      }
    };

    const goToGraph = (product) => {
      if (!product || !product.name) {
        console.error('Invalid product data');
        return;
      }

      try {
        window.location.href = `/product/${product.name}`;
      } catch (err) {
        console.error('Navigation error:', err);
      }
    };

    onBeforeUnmount(() => {
      debouncedSearchFn.cancel();
    });

    return {
      searchTerm,
      products,
      isLoading,
      error,
      searchProduct,
      handleEnter,
      debouncedSearch: () => debouncedSearchFn(searchTerm.value),
      goToGraph
    };
  }
};
</script>

<style scoped>
/* Container for full-page centering and background */
.search-container {
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 70vh;
  background: linear-gradient(to bottom right, #e4f1fc, #c3e3fa);
}

/* Search bar container */
.search-bar {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 50px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  max-width: 600px;
  width: 100%;
  z-index: 2; /* Ensure it's above the error message */
}

/* Search input styling */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 50px;
  background-color: transparent;
  color: #333;
}

/* Search button */
.search-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-button:hover {
  background-color: #357abd;
}

/* Error message */
.error {
  margin-top: 12px; /* Space under search bar */
  text-align: center;
  color: #dc3545;
  background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent white */
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #dc3545;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  z-index: 1; /* Positioned under search bar if overlapping occurs */
}

/* Loading indicator */
.loading {
  text-align: center;
  padding: 12px;
  color: #666;
}

/* Search results */
.results {
  margin-top: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
}

.results ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.results li {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  font-size: 16px;
  color: #333;
  background-color: white;
  transition: all 0.2s ease;
}

.results li:last-child {
  border-bottom: none;
}

.results li:hover {
  background-color: #f5f5f5;
  color: #4a90e2;
}

/* Background container for the full-page effect */
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #bcdbef 25%, transparent 25%, transparent 50%, #bcdbef 50%, #8ea2ae 75%, transparent 75%, transparent);
  background-size: 20px 20px;
  z-index: 0; /* Ensure it remains in the background */
}
</style>
