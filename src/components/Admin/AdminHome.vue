<template>
  <div>
    <!-- navbar -->
    <!-- 0: Dashboard, 1: Application, 2: Programs, 3: Profile, 4: Notification icon, 5: Profile icon -->
    <div>
      <div id="dashboard-container" class="flex-row align-center">
        <div id="dashboard-container2" class="pa-2 rounded-l-pill">
          <div id="rightSideDashboard">
            <v-img
              src="@/assets/sparky.png"
              max-height="75"
              max-width="75"
              class="db-logo"
            >
            </v-img>
            <div id="navigations">
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="updatePageBody(0)"
                :class="this.page == 0 ? 'primary--text text--darken-1' : ''"
              >
                Dashboard
              </v-btn>
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="updatePageBody(1)"
                :class="this.page == 1 ? 'primary--text text--darken-1' : ''"
              >
                Application
              </v-btn>
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="updatePageBody(2)"
                :class="this.page == 2 ? 'primary--text text--darken-1' : ''"
              >
                Programs
              </v-btn>
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="updatePageBody(3)"
                :class="this.page == 3 ? 'primary--text text--darken-1' : ''"
              >
                Profile
              </v-btn>
            </div>
            <div id="dashboard-container3" class="pa-8 rounded-l-pill">
              <v-btn class="main-action" elevation="0">
                <v-icon
                  aria-hidden="false"
                  style="color: #00a99e"
                  @click="updatePageBody(4)"
                >
                  mdi-bell
                </v-icon>
              </v-btn>
              <v-btn
                class="main-action"
                elevation="0"
                @click="updatePageBody(5)"
              >
                <v-icon aria-hidden="false" style="color: #00a99e">
                  mdi-account-circle
                </v-icon>
                &nbsp; &nbsp; {{ this.user.displayName }}
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- different pages -->
    <InviteAdmin v-if="page == 0" />
    <EmailUI v-if="page == 0" />
    <AdminApplicationDashboard v-if="page == 1" />
    <ApplicationFormListDisplay v-if="page == 2" />
    <Profile v-if="page == 3" />
    <div v-if="page == 5">
      <v-btn class="main-action" elevation="0" @click="signOut()">
        Sign Out
      </v-btn>
    </div>
  </div>
</template>

<script>
import EmailUI from "@/components/Admin/EmailUI.vue";
import InviteAdmin from "@/components/Admin/InviteAdmin.vue";
import AdminApplicationDashboard from "@/components/Admin/AdminApplicationDashboard.vue";
import ApplicationFormListDisplay from "@/components/Application/ApplicationFormListDisplay.vue";
import Profile from "@/components/Student/Profile.vue";

export default {
  name: "AdminHome",
  components: {
    EmailUI,
    ApplicationFormListDisplay,
    Profile,
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
    },
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  async mounted() {}
};
</script>

<style scoped>
v-btn {
  color: #00a99e;
}

.main-action {
  margin-right: 10px !important;
}

div#dashboard-container {
  background-color: #00a99e;
  width: 100%;
  justify-content: space-between;
}

div#dashboard-container2 {
  background-color: #cceeec;
  width: 98%;
  margin-left: auto;
}

div#dashboard-container3 {
  background-color: #00a99e;
  width: 25%;
  margin-left: auto;
  margin-top: -12px;
  margin-right: -12px;
  margin-bottom: -12px;
}

div#rightSideDashboard {
  display: flex;
  align-items: center;
}

.nav-btn {
  background-color: transparent !important;
  color: black !important;
  font-weight: 900 !important;
  border: none !important;
  font-size: 18px;
}

.db-logo {
  margin: 5px 25px;
}
</style>
