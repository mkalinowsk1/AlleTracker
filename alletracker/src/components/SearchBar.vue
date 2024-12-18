<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search for product"
        class="search-input"
        @input="debouncedSearch"
        @keyup.enter="handleEnter"
      />
      <button @click="searchProduct" class="search-button">
        <span>&#10140;</span>
      </button>
    </div>

    <div v-if="isLoading" class="loading">
      Searching...
    </div>

    <div v-if="error" class="error">
      {{ error }}
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
.search-bar {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  color: #333;
  background-color: white;
}

.search-input:focus {
  border-color: #4a90e2;
  outline: none;
}

.search-button {
  padding: 8px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #357abd;
}

.results {
  margin-top: 16px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  color: #333;  /* Dark gray text color for good contrast */
  background-color: white;
  transition: all 0.2s ease;
}

.results li:last-child {
  border-bottom: none;
}

.results li:hover {
  background-color: #f5f5f5;
  color: #4a90e2;  /* Change text color on hover */
}

.loading {
  text-align: center;
  padding: 12px;
  color: #666;
}

.error {
  color: #dc3545;
  padding: 12px;
  margin-top: 8px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dc3545;
}
</style>
