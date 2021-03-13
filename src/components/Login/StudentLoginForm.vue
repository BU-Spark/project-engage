<template>
  <div>
    <v-alert dark v-if="errorMsg">
      {{ errorMsg }}
    </v-alert>
    <h3>Student Login</h3>
    <div><v-btn class="ma-2" @click="studentLogin"> Student Login </v-btn></div>
  </div>
</template>

<script>
import firebase from "firebase/app";
//import store from "@/store";
import { auth } from "@/firebase/init";

export default {
  name: "studentLoginForm",
  data() {
    return {
      email: null,
      password: null,
      errorMsg: null
    };
  },
  components: {},
  computed: {
    adminValidation() {
      return this.$store.state.adminValidation;
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async studentLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: "bu.edu",
        prompt: "select_account"
      });
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    }
  },
  async mounted() {
    auth.getRedirectResult().then(async result => {
      if (result.additionalUserInfo.profile.hd == "bu.edu") {
        //if this is a BU email
        if (!this.user) {
          await this.$store.dispatch("setUser", "student");
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
