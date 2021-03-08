<template>
  <div>
    Welcome!

    <h1>{{ this.email }}</h1>
    <Button @click="signOut"> Log Out</Button>
  </div>
</template>

<script>
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
    },
    potentialAdminList() {
      return this.$store.state.potentialAdminList;
    }
  },
  data() {
    return {
      email: null,
      invitedAdminList: null
    };
  },
  async mounted() {
    await store.dispatch("getUser");
    this.email = this.user.email;
    await store.dispatch("getPotentialAdmin");
    this.invitedAdminList = this.potentialAdminList.adminInviteList;
    // console.log(this.email);
    // console.log(this.invitedAdminList);
  }
};
</script>
