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
                    'border: 6px solid #00A99E;background-color:black;width:70%;height:70%'
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

      <!-- display "student" or "admin" selection animation -->
      <v-col cols="12" md="7">
        <v-container fill-height fluid>
          <v-row align="center" justify="center">
            <v-col class="d-flex flex-column justify-center align-center">
              <center>
                <v-alert v-if="errorMsg"> {{ errorMsg }}</v-alert>
                <h3>Gmail Login</h3>
                <h4>
                  <GoogleLoginButton buttonLabel="Sign in with Google" />
                </h4>
                <br />
                <h3>Sign Up</h3>
                <br />
                <v-btn color="#36bd90" class="ma-4" @click="admin" rounded>
                  Admin SignUp
                </v-btn>
                <GoogleLoginButton buttonLabel="Sign up with Google" />
              </center>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import store from "@/store";
import GoogleLoginButton from "@/components/Login/GoogleLoginButton";
export default {
  name: "LoginForm",
  components: {
    GoogleLoginButton
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
    return {};
  },
  methods: {
    admin() {
      this.$router.push("/AdminLogin");
    },
    applicationForm() {
      this.$router.push("/application");
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
