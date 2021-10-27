<template>
  <div>
    <!-- navbar -->
    <!-- 0: Dashboard, 1: Application, 2: Profile & Profile icon, 3: Notification icon -->
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
                Profile
              </v-btn>
            </div>
            <div id="dashboard-container3" class="pa-8 rounded-l-pill">
              <v-btn class="main-action" elevation="0">
                <v-icon
                  aria-hidden="false"
                  style="color: #00a99e"
                  @click="updatePageBody(3)"
                >
                  mdi-bell
                </v-icon>
              </v-btn>
              <v-btn
                class="main-action"
                elevation="0"
                @click="updatePageBody(2)"
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
                      @click="updatePageBody(0)"
                      :class="
                        this.page == 0 ? 'primary--text text--darken-1' : ''
                      "
                    >
                      Dashboard
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      elevation="0"
                      class="nav-btn"
                      @click="updatePageBody(1)"
                      :class="
                        this.page == 1 ? 'primary--text text--darken-1' : ''
                      "
                    >
                      Profile
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn class="main-action" elevation="0">
                      <v-icon
                        aria-hidden="false"
                        style="color: #00a99e"
                        @click="updatePageBody(3)"
                      >
                        mdi-bell
                      </v-icon>
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <v-btn
                      class="main-action"
                      elevation="0"
                      @click="updatePageBody(2)"
                    >
                      <v-icon aria-hidden="false" style="color: #00a99e">
                        mdi-account-circle
                      </v-icon>
                      &nbsp; &nbsp; {{ this.user.displayName }}
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- different pages -->
    <ApplicationView v-if="page == 0" />
    <Profile v-if="page == 1" />
    <div v-if="page == 2">
      <v-btn class="main-action" elevation="0" @click="signOut()">
        Sign Out
      </v-btn>
    </div>
  </div>
</template>

<script>
import ApplicationView from "@/components/Student/ApplicationView.vue";
import Profile from "@/components/Student/Profile.vue";
export default {
  name: "StudentHome",
  components: {
    Profile,
    ApplicationView
  },
  data() {
    return {
      page: 0,
      window
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
