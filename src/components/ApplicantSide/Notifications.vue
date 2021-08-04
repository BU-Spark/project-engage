<template>
  <h1>NOTIFICATIONS PAGE</h1>
</template>

<script>
import Vue from "vue";
import { firestorePlugin } from "vuefire";
Vue.use(firestorePlugin);
import "firebase/firestore";
// import { auth } from "@/firebase/init";
export const curPageStatus = new Vue();
export default {
  name: "Profile",
  // props: ["currentPage"],
  components: {},
  data() {
    return {
      pageStatus: 0
    };
  },
  created() {
    curPageStatus.$on("changePageStatus", cps => {
      this.pageStatus = cps;
    });
  },
  computed: {
    // user() {
    //   return store.state.user;
    // }
  },
  methods: {
    // startNewApp: this.$router.push("@/views/NotFound.vue")
    updatePageStatus(pageStatus) {
      curPageStatus.$emit("changePageStatus", pageStatus);
    }
  },
  mounted() {}
};
</script>

<style scoped>
.check-btn {
  color: #36bd90 !important;
  border-radius: 150px !important;
  background-color: transparent !important;
}
.profile-additionals,
.profile-edit-additionals {
  text-align: left !important;
  margin-top: 15px !important;
}
.body-profile {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  position: static;
}
.body-profile h5 {
  margin: 0px !important;
  text-align: left !important;
  padding: 2px 5px !important;
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
.header-profile {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  position: static;
  margin-bottom: 25px;
}
.submit-profile-btn {
  background-color: #36bd90 !important;
  color: black !important;
  width: 170px !important;
}
.edit-profile-btn {
  background-color: #ffc65d !important;
  width: 170px !important;
}
v-btn {
  color: #e7f1ee;
}
</style>
