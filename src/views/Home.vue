<template>
  <div>
    Welcome!
    <Button @click="logOut"> Log Out</Button>
  </div>
</template>

<script>
// @ is an alias to /src
// import firebase from "firebase/app";
import { auth } from "@/firebase/init";

export default {
  name: "Home",
  components: {},
  methods: {
    logOut() {
      auth
        .signOut()
        .then(function() {})
        .catch(function(error) {
          console.log(error);
        });
      this.$router.push("/");
    }
  },
  mounted() {
    console.log(auth.currentUser);
  }
};
</script>
