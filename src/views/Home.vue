<template>
  <div>
    <div>
      <div id="dashboard-container" class="d-flex flex-row mb-6 align-center">
        <div id="rightSideDashboard">
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
    Welcome!

    <h1>{{ this.user.email }}</h1>
    <div v-if="this.isAdmin">
      <AdminHome />
    </div>
    <div v-if="!this.isAdmin">
      <StudentHome />
    </div>
    <v-btn elevation="2" outlined plain raised class="ma-2" @click="signOut">
      Log Out</v-btn
    >
  </div>
</template>

<script>
import store from "@/store";
import AdminHome from "@/components/Admin/AdminHome.vue";
import StudentHome from "@/components/StudentHome.vue";

export default {
  name: "Home",
  components: {
    AdminHome,
    StudentHome
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    adminValidation() {
      return store.state.adminValidation;
    },
    snapshot() {
      return store.state.snapshot;
    }
  },
  data() {
    return {
      addAdminEmail: null,
      emailValidated: false,
      adminExists: false
    };
  },
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  async mounted() {}
};
</script>

<style scoped>
div#main-actions {
  margin-right: 25px !important;
  float: right !important;
  right: -25px !important;
  padding: 15px !important;
  text-align: left !important;
}
v-btn {
  color: #36bd90;
}
.main-action {
  margin-right: 10px !important;
  border-radius: 15px;
  padding: 15px 0px;
}
div#dashboard-container {
  background-color: #36bd90;
  color: black;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}
div#rightSideDashboard {
  display: flex;
  justify-content: left;
  align-items: center;
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

