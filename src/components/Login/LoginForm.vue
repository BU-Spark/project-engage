<template>
  <v-container>
    <v-alert dark v-if="errorMsg">
      {{ errorMsg }}
    </v-alert>
    <div><v-btn class="ma-2" @click="login"> Login </v-btn></div>

    <v-divider inset></v-divider>
    <h3 class="my-4">Don't have an account? Sign up here!</h3>
    <div>
      <v-btn class="ma-4" @click="login"> Student SignUp </v-btn>
      <v-btn class="ma-4" @click="admin"> Admin SignUp </v-btn>
    </div>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import { auth } from "@/firebase/init";
import store from "@/store";
export default {
  name: "LoginForm",
  computed: {
    user() {
      return store.state.user;
    },
    adminValidation() {
      return store.state.adminValidation;
    }
  },
  data() {
    return {
      errorMsg: null
    };
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
  },
  mounted() {
    if (this.user) {
      this.$router.push("/home");
    }
    auth.getRedirectResult().then(async result => {
      if (result.user != null) {
        await store.dispatch(
          "validateAdmin",
          result.additionalUserInfo.profile.email
        );
        if (
          store.state.adminValidation ||
          result.additionalUserInfo.profile.hd == "bu.edu"
        ) {
          //if this is a BU email or the user is a validated admin
          if (!this.user) {
            await store.dispatch("setUser");
          }
        } else {
          //if it is not a BU email
          this.errorMsg =
            "You can only sign up for student accounts using BU accounts";
          setTimeout(() => {
            store.dispatch("logOut");
          }, 5000);
        }
      }
    });
  }
};
</script>
