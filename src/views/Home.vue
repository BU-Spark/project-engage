<template>
  <div>
    Welcome!

    <h1>{{ this.user.email }}</h1>
    <div v-if="this.isAdmin">
      <p>Successfully logged in as admin</p>
      <div>
        <v-text-field outlined v-model="addAdminEmail"> </v-text-field>
        <Button @click="addAdmin()"> Admin add admin page </Button>
      </div>
    </div>
    <Button @click="signOut"> Log Out</Button>
  </div>
</template>

<script>
import { db } from "@/firebase/init";
export default {
  name: "Home",
  components: {},
  computed: {
    user() {
      return this.$store.state.user;
    },
    isAdmin() {
      return this.$store.state.isAdmin;
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
        alert("Invited: " + this.addAdminEmail);
        await db
          .collection("invites")
          .doc()
          .set({
            inviteeEmail: this.addAdminEmail,
            invitorEmail: this.user.email
          })
          .then(() => {
            // this.$router.push("/");
          });
      } else {
        alert("Please enter a email");
      }
    }
  },
  async mounted() {}
};
</script>
