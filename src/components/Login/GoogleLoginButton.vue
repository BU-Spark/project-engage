<template>
  <div>
    <v-btn color="#228B22" class="ma-2" @click="googleLogin">
      {{ buttonLabel }}
    </v-btn>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { auth } from "@/firebase/init";
import store from "@/store";
export default {
  name: "GoogleLoginButton",
  props: ["buttonLabel", "email"],
  data() {
    return {
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
      if (this.email) {
        provider.setCustomParameters({
          prompt: "select_account",
          login_hint: this.email
        });
      }
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    }
  },
  mounted() {
    auth.getRedirectResult().then(async result => {
      if (result.user != null) {
        await store.dispatch(
          "validateAdmin",
          result.additionalUserInfo.profile.email
        );
        console.log(this.adminValidation);
        if (
          this.adminValidation ||
          result.additionalUserInfo.profile.hd == "bu.edu"
        ) {
          //console.log("here");
          //if this is a BU email or the user is a validated admin
          if (this.user) {
            this.$router.push("/home");
          }
        } else {
          //if it is not a BU email
          this.errorMsg =
            "You can only sign up for student accounts using BU accounts";
          store.commit("setErrorMsg", this.errorMsg);
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
