<template>
  <v-app>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-alert v-if="errorMsg"> {{ errorMsg }}</v-alert>
        <v-row id="card" no-gutters align-content="center" justify="center">
          <v-col cols="12" md="6">
            <center>
              <v-img
                :src="require('../../assets/sparky.png')"
                height="251px"
                width="251px"
                border-radius="100px"
              ></v-img>
            </center>
            <h1>Welcome to SPARK!</h1>
          </v-col>
          <v-col cols="12" md="6">
            <center>
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

              <!-- application form: TO BE MOVED LATER -->
              <v-btn
                color="#36bd90"
                class="ma-4"
                @click="applicationForm"
                rounded
              >
                Application Form
              </v-btn>
            </center>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
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
