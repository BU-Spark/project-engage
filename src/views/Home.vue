<template>
  <div>
    Welcome!

    <h1>{{ this.user.email }}</h1>
    <div v-if="this.isAdmin">
      <p>Successfully logged in as admin</p>
      <div>
        <v-text-field outlined v-model="addAdminEmail"> </v-text-field>
        <Button @click="addAdmin()"> Invite Admin </Button>
      </div>
    </div>
    <Button @click="signOut"> Log Out</Button>
  </div>
</template>

<script>
import { db } from "@/firebase/init";
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
      addAdminEmail: null
    };
  },
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
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
            })
            .then(() => {});

          // admin.auth().getUserByEmail(this.addAdminEmail).then((user) => {
          //   console.log("here")
          //   const currentCustomClaims = user.customClaims;
          //   if (currentCustomClaims['admin']) {
          //     return admin.auth().setCustomUserClaims(user.uid, { admin: true });
          //   }
          // })
          // .catch((error) => {
          //   console.log(error);
          // });

          alert("Invited: " + this.addAdminEmail);
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
