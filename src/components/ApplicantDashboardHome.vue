<template>
  <div>
    <Dashboard> </Dashboard>
    <Apps> </Apps>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard/Dashboard.vue";
import Apps from "@/components/Dashboard/Apps.vue";
import store from "@/store";
// import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
export default {
  name: "ApplicantDashboardHome",
  components: {
    Dashboard,
    Apps
    // GoogleLoginButton
  },
  computed: {
    adminValidation() {
      return store.state.adminValidation;
    },
    user() {
      return store.state.user;
    }
  },
  methods: {}
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
v-text-field {
  width: 200;
}
</style>
