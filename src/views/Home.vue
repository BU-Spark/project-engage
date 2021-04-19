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
          v-if="!this.adminExists"
        >
          Invite Admin
        </v-btn>
        <v-alert dark v-if="this.adminExists">
          This email is currently registered as a student account, please click
          Change Role if you want to assign them admin permission
        </v-alert>
        <v-btn
          elevation="2"
          outlined
          plain
          raised
          class="ma-2"
          @click="changeRole()"
          v-if="this.adminExists"
        >
          Change Role
        </v-btn>
      </div>
      <v-container>
        <EmailUI />
      </v-container>
    </div>
    <v-btn elevation="2" outlined plain raised class="ma-2" @click="signOut">
      Log Out</v-btn
    >
  </div>
</template>

<script>
import { functions, db } from "@/firebase/init";
import store from "@/store";
import EmailUI from "@/components/EmailUI.vue";
// const admin = require("firebase-admin");
// admin.initializeApp({ projectId: "spark-project-engage" });

export default {
  name: "Home",
  components: {
    EmailUI
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
    },
    adminValidation() {
      return store.state.adminValidation;
    },
    snapshot() {
      return store.state.snapshot;
    }
  },
  data() {
    return {
      addAdminEmail: null,
      emailValidated: false,
      adminExists: false,
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
          await store.dispatch("getSnapshot", [
            "users",
            "email",
            this.addAdminEmail
          ]);
          if (this.snapshot.size > 0) {
            this.adminExists = true;
          } else {
            await functions.httpsCallable("sendInviteEmails")({
              email: this.addAdminEmail
            });
            this.addAdminEmail = "";
            alert("invited email");
          }
        } else {
          alert("This email had already been invited to sign up as admin");
        }
      } else {
        alert("Please enter a email");
      }
    },
    async changeRole() {
      this.snapshot.forEach(doc => {
        functions.httpsCallable("processChangeRole")({
          id: doc.id
        });
      });
      this.adminExists = false;
      this.addAdminEmail = "";
      alert("changed role");
    }
  },
  async mounted() {}
};
</script>
