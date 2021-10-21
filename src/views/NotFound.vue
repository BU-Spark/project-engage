<template>
  <div class="notFound">
    <h2>404 Not Found</h2>
    <p>
      Oops, it looks like we could not find that page 😬... Try going home
      <router-link to="/">🏠</router-link>
    </p>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h2 {
  font-size: 4em;
}
p {
  font-size: 2em;
}
a {
  color: white;
}
.notFound {
  min-height: calc(100vh - 100px);
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em 4em;
  flex-direction: column;
}
</style>
