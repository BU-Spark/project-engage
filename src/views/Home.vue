<template>
  <div>
    Welcome!

    <h1>{{ this.user.email }}</h1>
    <div v-if="this.isAdmin">
      <p>Successfully logged in as admin</p>
      <div>
        <v-text-field
          outlined
          v-model="addAdminEmail"
          :rules="emailRules"
          @change="checkEmail"
        >
        </v-text-field>
        <v-btn
          elevation="2"
          outlined
          plain
          raised
          class="ma-2"
          @click="addAdmin()"
          :disabled="!emailValidated"
        >
          Invite Admin
        </v-btn>
      </div>
    </div>
    <v-btn elevation="2" outlined plain raised class="ma-2" @click="signOut">
      Log Out</v-btn
    >
  </div>
</template>

<script>
import { functions, db } from "@/firebase/init";
import store from "@/store";
// const admin = require("firebase-admin");
// admin.initializeApp({ projectId: "spark-project-engage" });

export default {
  name: "Home",
  components: {},
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    adminValidation() {
      return store.state.adminValidation;
    }
  },
  data() {
    return {
      addAdminEmail: null,
      emailValidated: false,
      emailRules: [
        v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "Please enter a valid email"
      ]
    };
  },
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    },
    checkEmail() {
      if (
        !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          this.email
        )
      ) {
        this.emailValidated = true;
        return;
      }
      this.emailValidated = false;
    },
    async addAdmin() {
      if (this.addAdminEmail != null) {
        await store.dispatch("validateAdmin", this.addAdminEmail);
        if (!(await this.adminValidation)) {
          await db
            .collection("invites")
            .doc()
            .set({
              inviteeEmail: this.addAdminEmail,
              invitorEmail: this.user.email
            });
          alert("Invited: " + this.addAdminEmail);
          await functions.httpsCallable("sendInviteEmails")({
            email: this.addAdminEmail
          });
        } else {
          alert("This email had already been invited to sign up as admin");
        }
        this.addAdminEmail = "";
      } else {
        alert("Please enter a email");
      }
    }
  },
  async mounted() {}
};
</script>
