<template>
  <div>
    <div id="main-container">
      <h1>No Applications in Progress <br /></h1>
      <br />
      <h1>
        <v-btn className="new-app-btn" @click="startNewApp()">
          Start New Application
          <v-icon aria-hidden="false" style="color:#36BD90"
            >mdi-arrow-right-drop-circle</v-icon
          >
        </v-btn>
      </h1>
    </div>
  </div>
</template>

<script>
// import firebase from "firebase/app";
// import { auth } from "@/firebase/init";
export default {
  name: "Apps",
  // props: ["currentPage"],
  components: {},
  computed: {
    // user() {
    //   return store.state.user;
    // }
  },
  methods: {
    startNewApp() {
      this.$router.push("@/views/BaseApplication.vue");
    }
  },
  mounted() {}
};
</script>

<style scoped>
.new-app-link {
  text-align: center !important;
  color: black !important;
  font-size: 30px !important;
}
v-btn {
  color: #36bd90;
}
#main-container {
  border-radius: 25px;
  background-color: rgb(227, 227, 255);
  color: black;
  font-weight: 750;
  padding: 25px;
  min-height: 570px !important;
  margin: 10px;
  text-align: center;
}
.new-app-btn {
  border-radius: 5px !important;
  background-color: transparent !important;
  border: 4px solid #219e75;
  font-weight: 700 !important;
  font-size: 16px !important;
}
</style>
