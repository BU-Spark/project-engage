<template>
  <div>
    <!-- navbar -->
    <!-- 0: Dashboard, 1: Application, 2: Profile & Profile icon, 3: Notification icon -->
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
              Dashboard
            </v-btn>
            <v-btn elevation="0" class="nav-btn" @click="updatePageBody(1)">
              Application
            </v-btn>
            <v-btn elevation="0" class="nav-btn" @click="updatePageBody(2)">
              Profile
            </v-btn>
          </div>
        </div>
        <div id="main-actions">
          <v-btn class="main-action" elevation="0">
            <v-icon
              aria-hidden="false"
              style="color: #36bd90"
              @click="updatePageBody(3)"
            >
              mdi-bell
            </v-icon>
          </v-btn>
          <v-btn class="main-action" elevation="0" @click="updatePageBody(2)">
            <v-icon aria-hidden="false" style="color: #36bd90">
              mdi-account-circle
            </v-icon>
            &nbsp; &nbsp; {{ this.user.displayName }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- different pages -->
    <Dashboard v-if="page == 0" />
    <Profile v-if="page == 2" />
  </div>
</template>

<script>
import Dashboard from "@/components/Student/Dashboard.vue";
import Profile from "@/components/Student/Profile.vue";
export default {
  name: "StudentHome",
  components: {
    Dashboard,
    Profile
  },
  data() {
    return {
      page: 0
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    updatePageBody(index) {
      this.page = index;
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
