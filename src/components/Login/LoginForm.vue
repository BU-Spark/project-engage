<template>
  <v-app>
    <v-row no-gutters>
      <!-- display spark! logo and "Welcome to Spark!" -->
      <v-col cols="12" md="5">
        <v-container
          fill-height
          fill-width
          fluid
          style="background-color:black; "
        >
          <v-row align="center" justify="center">
            <v-col>
              <center>
                <v-card
                  class="rounded-circle"
                  :style="
                    'border: 6px solid #00A99E; background-color:black; width:70%; height:70%'
                  "
                >
                  <v-col class="d-flex flex-column justify-center align-center">
                    <v-img
                      :src="require('../../assets/sparky.png')"
                      height="90%"
                      width="90%"
                      border-radius="100%"
                      outl
                      style="margin-bottom: 5%; margin-top: 3%; margin-right: 5%; margin-left: 5%"
                    ></v-img>
                  </v-col>
                </v-card>
              </center>
              <div
                style="display:block; background-color: black; height: 30px;"
              ></div>
              <h1 style="color:#00A99E; font-weight: 900;">
                <span style="color:white; font-weight: 900;">Welcome to </span
                >SPARK!
              </h1>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- display "student" or "admin" selection animation (with different views) -->
      <v-col cols="12" md="7">
        <v-container fill-height fluid>
          <!-- view 0: choose role -->
          <v-col
            v-if="view == 0"
            class="d-flex flex-column justify-center align-center"
          >
            <!-- invisible login button so that login page router push is successful -->
            <GoogleLoginButton buttonLabel="Sign in with Google" hide="true" />

            <v-row>
              <v-card
                class="mx-auto"
                outlined
                @click.native="clickedRole('student')"
                :style="
                  roleSelected == 'student' ? 'border: 5px solid #00A99E;' : ''
                "
              >
                <h1 style="font-weight: 900;">Student</h1>
              </v-card>
              <div style="display:block; width: 40px;"></div>
              <v-card
                class="mx-auto"
                outlined
                @click.native="clickedRole('admin')"
                :style="
                  roleSelected == 'admin' ? 'border: 5px solid #00A99E;' : ''
                "
              >
                <h1 style="font-weight: 900;">Admin</h1>
              </v-card>
            </v-row>
            <v-btn
              x-large
              color="#00A99E"
              class="ma-4 pl-16 pr-16 white--text bold--text"
              style="font-weight: 900; font-size:20px;"
              rounded
              @click="updateView(1)"
            >
              CONTINUE
            </v-btn>
          </v-col>

          <!-- view 1 student: log in -->
          <v-col
            v-if="view == 1 && roleSelected == 'student'"
            class="d-flex flex-column justify-center align-center"
          >
            <h1>Student sign in</h1>
            <GoogleLoginButton buttonLabel="Sign in with Google" />
            <v-btn class="ma-4" @click="updateView(0)">
              Back
            </v-btn>
          </v-col>

          <!-- view 1 admin: log in or sign up -->
          <v-col
            v-if="view == 1 && roleSelected == 'admin'"
            class="d-flex flex-column justify-center align-center"
          >
            <h1>Admin sign in</h1>
            <v-alert v-if="errorMsg"> {{ errorMsg }}</v-alert>
            <h3>Login</h3>
            <h4>
              <GoogleLoginButton buttonLabel="Log in with Google" />
            </h4>
            <br />
            <h3>Sign Up</h3>
            <v-btn color="#36bd90" class="ma-4" @click="updateView(2)" rounded>
              Admin Sign Up
            </v-btn>
            <v-btn class="ma-4" @click="updateView(0)">
              Back
            </v-btn>
          </v-col>

          <!-- view 2 admin sign up: check email -->
          <v-col
            v-if="view == 2 && roleSelected == 'admin'"
            class="d-flex flex-column justify-center align-center"
          >
            <AdminLogin />
          </v-col>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import store from "@/store";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
import AdminLogin from "@/views/AdminLogin";
export default {
  name: "LoginForm",
  components: {
    GoogleLoginButton,
    AdminLogin
  },
  computed: {
    adminValidation() {
      return store.state.adminValidation;
    },
    errorMsg() {
      return store.state.errorMsg;
    }
  },
  data() {
    return {
      roleSelected: null,
      view: 0
    };
  },
  methods: {
    applicationForm() {
      this.$router.push("/application");
    },
    clickedRole(role) {
      if (role == "student") {
        this.roleSelected = "student";
      } else {
        this.roleSelected = "admin";
      }
    },
    updateView(page) {
      if (this.roleSelected != null) {
        this.view = page;
      }
    }
  }
};
</script>

<style scoped>
v-btn {
  color: #36bd90;
}

h3 {
  margin: 30px 0 0;
}
</style>
