<template>
  <div class="homepage">
    <header>
      <h1>Welcome to My Vue App</h1>
      <p>Your one-stop solution for all things Vue!</p>
    </header>
    <main>
      <section>
        <h2>About Us</h2>
        <p>
          We are passionate about building amazing applications with Vue.js.
          Join us as we explore the world of front-end development!
        </p>
      </section>
      <section>
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to reach out!</p>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 My Vue App. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
};
</script>

<style scoped>
.homepage {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
}

header {
  background-color: #007bff;
  color: white;
  padding: 20px;
}

main {
  margin: 20px 0;
}

footer {
  background-color: #007bff;
  color: white;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
