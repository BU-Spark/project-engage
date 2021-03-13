<template>
  <div>
    <v-alert dark v-if="errorMsg">
      {{ errorMsg }}
    </v-alert>
    <h3>Admin Login</h3>
    <v-btn class="ma-2" @click="adminLogin"> Admin Login </v-btn>

    <div>
      <v-text-field outlined v-model="addAdminEmail"> </v-text-field>
      <Button @click="addAdmin()"> Admin add admin page </Button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
//import store from "@/store";
import { db, auth } from "@/firebase/init";

export default {
  name: "AdminLoginForm",
  data() {
    return {
      email: null,
      password: null,
      addAdminEmail: null,
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
    async adminLogin() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.useDeviceLanguage();
      auth.signInWithRedirect(provider);
    },
    async addAdmin() {
      if (this.addAdminEmail != null) {
        alert("Entered email: " + this.addAdminEmail);

        await db
          .collection("invites")
          .doc()
          .set({
            inviteeEmail: this.addAdminEmail,
            invitorEmail: "invitorEmail@bu.edu"
          })
          .then(() => {
            // this.$router.push("/");
          });
      } else {
        alert("Please enter a email");
      }
    }
  },
  async mounted() {
    await auth.getRedirectResult().then(async result => {
      if (!this.user) {
        await this.$store.dispatch(
          "validateAdmin",
          result.additionalUserInfo.profile.email
        );
        if (this.adminValidation) {
          await this.$store.dispatch("setUser", "admin");
          this.$router.push("/home");
        } else {
          this.errorMsg =
            "You can only proceed with admin account creation when it is approved!";
          setTimeout(() => {
            this.$store.dispatch("logOut");
          }, 1000);
        }
      } else {
        this.$router.push("/home");
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
