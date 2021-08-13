<template>
  <div>
    <Apps v-if="currentPage == 0"> </Apps>
    <Profile v-if="currentPage == 1"></Profile>
    <ApplicantSettings v-if="currentPage == 2"></ApplicantSettings>
    <Notifications v-if="currentPage == 3"></Notifications>
  </div>
</template>

<script>
import Apps from "@/components/ApplicantSide/Apps.vue";
import Profile from "@/components/ApplicantSide/Profile.vue";
import Notifications from "@/components/ApplicantSide/Notifications.vue";
import ApplicantSettings from "@/components/ApplicantSide/ApplicantSettings.vue";
import store from "@/store";
import { curAppPage } from "./ApplicantSide/Dashboard.vue";
// import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
export default {
  name: "ApplicantDashboardHome",
  components: {
    Apps,
    Profile,
    ApplicantSettings,
    Notifications
    // GoogleLoginButton
  },
  data() {
    return {
      currentPage: 0
    };
  },
  created() {
    curAppPage.$on("chaneCurrentPage", cp => {
      this.currentPage = cp;
    });
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
