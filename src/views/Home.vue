<template>
  <div>
    Welcome!

    <h1>{{ this.email }}</h1>
    <Button @click="signOut"> Log Out</Button>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
import store from "../store";

export default {
  name: "Home",
  components: {},
  methods: {
    async signOut() {
      await this.$store.dispatch("logOut");
      this.$router.push("/");
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      email: null,
      potentialAdmin: false
    };
  },
  async mounted() {
    await store.dispatch("getUser");
    this.email = this.user.email;
    const usersRef = db.collection("invites");
    const snapshot = await usersRef
      .where("inviteeEmail", "==", this.email)
      .get();
    if (!snapshot.empty) {
      this.potentialAdmin = true;
    }
    console.log(this.potentialAdmin);
  }
};
</script>
