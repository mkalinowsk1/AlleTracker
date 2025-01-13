<template>
  <header class="header">
    <div class="header-content">
      <h1 class="logo">
        <a href="/" class="logo-link">
          <span class="logo-highlight">Alle</span>Tracker
        </a>
      </h1>
      <p class="tagline">Track product statistics seamlessly on Allegro</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
};
</script>

<style scoped>
/* Header container with reduced height and padding */
.header {
  width: 100%;
  padding: 20px 10px; /* Reduced padding */
  background: linear-gradient(to bottom right, #e4f1fc, #c3e3fa);
  text-align: center;
  border-bottom: 2px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Softer shadow */
}

/* Centered content inside the header */
.header-content {
  max-width: 900px;
  margin: 0 auto;
}

/* Logo styles with smaller font size */
.logo {
  font-size: 1.8em; /* Reduced font size */
  font-weight: bold;
  margin: 0;
  color: #333;
}

/* Highlighted "Alle" text */
.logo-highlight {
  color: orange;
}

/* Link reset for the logo */
.logo-link {
  text-decoration: none;
  color: inherit;
  transition: color 0.2s ease;
}

.logo-link:hover {
  color: #4a90e2;
}

/* Tagline styles with smaller font size and tighter spacing */
.tagline {
  margin-top: 5px; /* Reduced margin */
  font-size: 0.9em; /* Smaller font size */
  color: #555;
  line-height: 1.4;
  font-weight: 300;
}
</style>
