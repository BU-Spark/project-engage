<template>
  <div>
    <!-- navbar -->
    <!-- 0: Dashboard, 1: Application, 2: Programs, 3: Reports, 4: Notification icon, 5: Profile icon -->
    <div>
      <div id="dashboard-container" class="d-flex flex-row mb-6 align-center">
        <div
          id="dashboard-container2"
          class="d-flex flex-row mb-6 align-center"
          v-bind:style="{ width: '150vh' }"
        >
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
                Programs
              </v-btn>
              <v-btn elevation="0" class="nav-btn" @click="updatePageBody(3)">
                Reports
              </v-btn>
            </div>
          </div>
          <div id="main-actions">
            <v-btn class="main-action" elevation="0">
              <v-icon
                aria-hidden="false"
                style="color: #36bd90"
                @click="updatePageBody(4)"
              >
                mdi-bell
              </v-icon>
            </v-btn>
            <v-btn class="main-action" elevation="0" @click="updatePageBody(5)">
              <v-icon aria-hidden="false" style="color: #00A99E">
                mdi-account-circle
              </v-icon>
              &nbsp; &nbsp; {{ this.user.displayName }}
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- different pages -->
    <InviteAdmin v-if="page == 0" />
    <EmailUI v-if="page == 0" />
    <AdminApplicationDashboard v-if="page == 1" />
    <ApplicationFormListDisplay v-if="page == 2" />
  </div>
</template>

<script>
import EmailUI from "@/components/Admin/EmailUI.vue";
import InviteAdmin from "@/components/Admin/InviteAdmin.vue";
import AdminApplicationDashboard from "@/components/Admin/AdminApplicationDashboard.vue";
import ApplicationFormListDisplay from "@/components/Application/ApplicationFormListDisplay.vue";

export default {
  name: "AdminHome",
  components: {
    EmailUI,
    ApplicationFormListDisplay,
    InviteAdmin,
    AdminApplicationDashboard
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
    },
    changeRoutes(route) {
      this.$router.push(route);
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
  background-color: #00a99e;
  color: black;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}

div#dashboard-container2 {
  background-color: #a90063;
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
