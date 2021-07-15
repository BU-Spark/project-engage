<template>
  <div>
    <div id="main-container">
      <h1>No Applications in Progress <br /></h1>
      <a class="d-flex flex-row align-center new-app-link">
        Start Application
        <v-btn class="new-app-btn" elevation="0" v-on:click="startNewApp"
          ><v-icon aria-hidden="false" style="color: #36bd90"
            >mdi-arrow-right-drop-circle</v-icon
          ></v-btn
        >
      </a>
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
    // startNewApp: this.$router.push("@/views/NotFound.vue")
  },
  mounted() {}
};
</script>

<style scoped>
.new-app-link {
  text-align: center !important;
  color: white !important;
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
  color: transparent !important;
  border-radius: 150px !important;
  margin: 5px !important;
  background-color: transparent !important;
}
</style>
