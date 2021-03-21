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
      return this.$store.state.user;
    },
    adminValidation() {
      return this.$store.state.adminValidation;
    }
  },
  methods: {
    async googleLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    }
  },
  async mounted() {
    auth.getRedirectResult().then(async result => {
      //   console.log(result.profile.email)
      await store.dispatch(
        "validateAdmin",
        result.additionalUserInfo.profile.email
      );
      if (
        this.$store.state.adminValidation ||
        result.additionalUserInfo.profile.hd == "bu.edu"
      ) {
        //if this is a BU email
        if (!this.user) {
          await this.$store.dispatch("setUser");
        }
        this.$router.push("/home");
      } else {
        //if it is not a BU email
        this.errorMsg =
          "You can only sign up for student accounts using BU accounts";
        setTimeout(() => {
          this.$store.dispatch("logOut");
        }, 1000);
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
