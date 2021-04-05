<template>
  <v-container>
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
  </v-container>
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
