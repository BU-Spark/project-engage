<template>
  <div>
    <v-alert dark v-if="errorMsg">
      {{ errorMsg }}
    </v-alert>
    <h3>Google Login</h3>
    <v-btn class="ma-2" @click="googleLogin"> Google Login </v-btn>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { auth } from "@/firebase/init";
import store from "@/store";
export default {
  name: "GoogleLoginForm",
  data() {
    return {
      email: null,
      password: null,
      errorMsg: null
    };
  },
  components: {},
  computed: {
    user() {
      return store.state.user;
    },
    adminValidation() {
      return store.state.adminValidation;
    }
  },
  methods: {
    async googleLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
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
          }, 1000);
        }
      }
    });
  }
};
</script>

<style scoped>
button {
  margin-top: 10px;
}
v-text-field {
  width: 200;
}
</style>
