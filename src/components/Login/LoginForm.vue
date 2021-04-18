<template>
  <center>
    <v-container class="ma-14">
      <v-row no-gutters style="height: 300px;">
        <v-col order="last" no-gutters>
          <v-card class="pa-14" outlined tile>
            <center>
              <v-img
                :src="require('../../assets/sparky.png')"
                height="250px"
                width="250px"
                border-radius="100px"
              ></v-img>
            </center>
            <center><h1>Welcome to SPARK!</h1></center>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="pa-2" outlined tile no-gutters>
            <center>
              <h3>Gmail Login</h3>
            </center>
            <center>
              <h4>
                <GoogleLoginButton
                  class="ma-2"
                  buttonLabel="Sign in with Google"
                />
              </h4>
            </center>

            <br />
            <center>
              <h3>Sign Up</h3>
            </center>
            <br />
            <center>
              <h4>
                <v-btn color="#36bd90" class="ma-4" @click="admin" rounded>
                  Admin SignUp
                </v-btn>
                <GoogleLoginButton
                  class="ma-4"
                  buttonLabel="Sign up with Google"
                />
              </h4>
            </center>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </center>
</template>

<script>
import firebase from "firebase/app";
import { auth } from "@/firebase/init";
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
    async login() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    },
    admin() {
      this.$router.push("/AdminLogin");
    }
  }
};
</script>

<style scoped>
/* // test {
  position: relative;
  margin-top: 15px auto;
  padding-top: 100px 0 0;
} */
.v-card {
  display: block;
  border-color: white !important;
  margin-top: 15vh;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
v-btn {
  color: #36bd90;
}
h3 {
  margin: 30px 0 0;
}
</style>
