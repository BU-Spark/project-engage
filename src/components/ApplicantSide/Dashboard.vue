<template>
  <div>
    <div id="dashboatd-container" class="d-flex flex-row mb-6 align-center">
      <v-img
        src="@/assets/sparky.png"
        max-height="75"
        max-width="75"
        class="db-logo"
      >
      </v-img>
      <div id="navigations">
        <v-btn elevation="0" class="nav-btn" @click="updatePageBody(0)">
          Dashboard</v-btn
        >
        <v-btn elevation="0" class="nav-btn"> Applicants </v-btn>
        <v-btn elevation="0" class="nav-btn"> Reports </v-btn>
      </div>
      <div id="main-actions">
        <v-btn class="main-action" elevation="0">
          <v-icon
            aria-hidden="false"
            style="color: #36bd90"
            @click="updatePageBody(2)"
          >
            mdi-cog
          </v-icon>
        </v-btn>
        <v-btn class="main-action" elevation="0">
          <v-icon
            aria-hidden="false"
            style="color: #36bd90"
            @click="updatePageBody(3)"
          >
            mdi-bell
          </v-icon>
        </v-btn>
        <v-btn class="main-action" elevation="0" @click="updatePageBody(1)">
          <v-icon aria-hidden="false" style="color: #36bd90">
            mdi-account-circle
          </v-icon>
          &nbsp; &nbsp; {{ this.user.displayName }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);
import "firebase/firestore";
// Get a Firestore instance
// import store & authentication
// import store from "@/store";
// LINK TO ALL ICONS: https://materialdesignicons.com
export const curAppPage = new Vue();
export default {
  name: "Dashboard",
  props: ["currentPage", "activeUser"],
  components: {},
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    updatePageBody(currentPage) {
      curAppPage.$emit("chaneCurrentPage", currentPage);
    }
  },
  mounted() {}
};
</script>

<style scoped>
div#main-actions {
  margin-right: 25px !important;
  float: right !important;
  right: -25px !important;
  padding: 15px !important;
}
v-btn {
  color: #36bd90;
}
.main-action {
  margin-right: 10px !important;
  border-radius: 15px;
  padding: 15px 0px;
}
div#dashboatd-container {
  background-color: #36bd90;
  color: black;
  padding: 15px;
  width: 100%;
}
.nav-btn {
  background-color: transparent !important;
  color: black !important;
  font-weight: 900 !important;
  border: none !important;
  /* font-size: 12px; */
}
.db-logo {
  margin: 5px 25px;
}
</style>
