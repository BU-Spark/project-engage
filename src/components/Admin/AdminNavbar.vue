<template>
  <div>
    <!-- navbar -->
    <!-- Dashboard: /home, Application: /studentApplications, Programs: /applicationForms, USER_NAME: /profile -->
    <!-- mainly for web display: if window > 1017 -->
    <div v-if="window > 1017">
      <div id="dashboard-container" class="flex-row align-center">
        <div id="dashboard-container2" class="rounded-l-pill">
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
                @click="changeRoutes('/home')"
                :class="
                  this.$route.name == 'home'
                    ? 'primary--text text--darken-1'
                    : ''
                "
              >
                Dashboard
              </v-btn>
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="changeRoutes('/studentApplications')"
                :class="
                  this.$route.name == 'studentApplications'
                    ? 'primary--text text--darken-1'
                    : ''
                "
              >
                Application
              </v-btn>
              <v-btn
                elevation="0"
                class="nav-btn"
                @click="changeRoutes('/applicationForms')"
                :class="
                  this.$route.name == 'applicationForms'
                    ? 'primary--text text--darken-1'
                    : ''
                "
              >
                Programs
              </v-btn>
            </div>
            <div id="dashboard-container3" class="pa-8 rounded-l-pill">
              <v-btn
                class="main-action"
                elevation="0"
                @click="changeRoutes('/profile')"
              >
                <v-icon aria-hidden="false" style="color: #00a99e">
                  mdi-account-circle
                </v-icon>
                <div v-if="window > 847">
                  &nbsp; &nbsp; {{ this.user?.displayName }}
                </div>
              </v-btn>
              <v-icon
                aria-hidden="false"
                style="color: white; font-size:xx-large;"
                @click="signOut()"
              >
                mdi-logout
              </v-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- mainly for mobile display: if window <= 1017 -->
    <div v-if="window <= 1017">
      <div id="dashboard-container" class="flex-row align-center">
        <div id="dashboard-container2" class="rounded-l-pill">
          <div id="rightSideDashboard">
            <div class="text-center">
              <v-img
                src="@/assets/sparky.png"
                max-height="75"
                max-width="75"
                class="db-logo"
              >
              </v-img>
            </div>
            <div id="dashboard-container3" class="pa-8 rounded-l-pill">
              <v-menu top :close-on-click="closeOnClick">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    large
                    aria-hidden="false"
                    style="color: white"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-arrow-down-drop-circle-outline
                  </v-icon>
                </template>

                <v-list>
                  <v-list-item>
                    <v-btn
                      elevation="0"
                      class="nav-btn"
                      @click="changeRoutes('/home')"
                      :class="
                        this.$route.name == 'home'
                          ? 'primary--text text--darken-1'
                          : ''
                      "
                    >
                      Dashboard
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      elevation="0"
                      class="nav-btn"
                      @click="changeRoutes('/studentApplications')"
                      :class="
                        this.$route.name == 'studentApplications'
                          ? 'primary--text text--darken-1'
                          : ''
                      "
                    >
                      Application
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      elevation="0"
                      class="nav-btn"
                      @click="changeRoutes('/applicationForms')"
                      :class="
                        this.$route.name == 'applicationForms'
                          ? 'primary--text text--darken-1'
                          : ''
                      "
                    >
                      Programs
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      class="main-action"
                      elevation="0"
                      @click="changeRoutes('/profile')"
                    >
                      <v-icon aria-hidden="false" style="color: #00a99e">
                        mdi-account-circle
                      </v-icon>
                      <div v-if="window > 847">
                        &nbsp; &nbsp; {{ this.user?.displayName }}
                      </div>
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn class="main-action" elevation="0">
                      <v-icon
                        aria-hidden="false"
                        style="color: #00a99e; font-size:xx-large;"
                        @click="signOut()"
                      >
                        mdi-logout
                      </v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminNavbar",
  components: {},
  data() {
    return {
      window
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    changeRoutes(route) {
      console.log(route);
      this.$router.push(route);
    },
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  async mounted() {
    this.window = window.innerWidth;
  }
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
