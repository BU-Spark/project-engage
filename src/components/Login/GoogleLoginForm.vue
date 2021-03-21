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
    }
  },
  methods: {
    async googleLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    }
  },
  async mounted() {}
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
