<template>
  <!-- <v-container>
    <v-alert dark v-if="this.errorMsg">
      {{ this.errorMsg }}
    </v-alert>
    <div>
      <GoogleLoginButton class="ma-2" buttonLabel="Login" />
    </div>

    <v-divider inset></v-divider>
    <h3 class="my-4">Don't have an account? Sign up here!</h3>
    <div>
      <GoogleLoginButton class="ma-2" buttonLabel="Student Sign Up" />
      <v-btn class="ma-4" @click="admin"> Admin SignUp </v-btn>
    </div>
  </v-container> -->

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
              <h3>For Students</h3>
            </center>
            <center>
              <h4>
                <GoogleLoginButton class="ma-2" buttonLabel="Login" />
              </h4>
            </center>

            <br />
            <center>
              <h3>For Admins</h3>
            </center>

            <center>
              <h4>
                <v-btn class="ma-4" @click="admin"> Admin SignUp </v-btn>
                <GoogleLoginButton class="ma-2" buttonLabel="Student Sign Up" />
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
h2 {
  margin: 110px 0 0;
  text-indent: 10px 0 0;
  padding-left: 180px;
}
</style>
