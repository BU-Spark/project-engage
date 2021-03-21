<template>
  <div>
    <div><v-btn class="ma-2" @click="student"> Student Login </v-btn></div>
    <div><v-btn class="ma-2" @click="admin"> Admin Login </v-btn></div>
  </div>
</template>

<script>
export default {
  name: "LoginForm",
  data() {
    return {};
  },
  methods: {
    student() {
      this.$router.push("/GoogleLogin");
    },
    admin() {
      this.$router.push("/AdminLogin");
    }
  }
};
</script>
