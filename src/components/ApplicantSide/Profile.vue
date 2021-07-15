<template>
  <div id="main-container">
    <div v-if="pageStatus == 0">
      <div class="header-profile d-flex flex-row mb-6 align-center">
        <v-img
          src="@/assets/null-profile-img.svg"
          max-height="75"
          max-width="75"
          class="profile-img"
        >
        </v-img>
        <v-btn class="edit-profile-btn" @click="updatePageStatus(1)">
          Edit
        </v-btn>
      </div>
      <div class="body-profile">
        <h5>First Name</h5>
        <h5>Last Name</h5>
        <h5>Email</h5>
        <h5>BU ID</h5>
        <h5>Cell Phone</h5>
        <h5>Portfolio Link</h5>
        <h5>Major</h5>
        <h5>Minor</h5>
        <h5>School Year</h5>
        <h5>Expected Graduation</h5>
        <h5>Gender</h5>
        <h5>GenderStudent</h5>
      </div>
    </div>

    <div v-if="pageStatus == 1">
      <div class="header-profile d-flex flex-row mb-6 align-center">
        <v-img
          src="@/assets/null-profile-img.svg"
          max-height="75"
          max-width="75"
          class="profile-img"
        >
        </v-img>
        <v-btn class="submit-profile-btn" @click="updatePageStatus(0)">
          Submit
        </v-btn>
      </div>
      <div class="body-profile">
        <input type="text" placeholder="First Name" />>
        <input type="text" placeholder="Last Name" />
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="BU ID" />
        <input type="text" placeholder="Cell Phone" />
        <input type="text" placeholder="Portfolio Link" />
        <input type="text" placeholder="Major" />
        <input type="text" placeholder="Minor" />
        <input type="text" placeholder="School Year" />
        <input type="text" placeholder="Expected Graduation" />
        <input type="text" placeholder="Gender" />
        <input type="text" placeholder="GenderStudent" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// import firebase from "firebase/app";
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
.body-profile {
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
  position: static;
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
}
.submit-profile-btn {
  background-color: #36bd90 !important;
  color: black !important;
}
.edit-profile-btn {
  background-color: #ffc65d !important;
}
v-btn {
  color: #e7f1ee;
}
</style>
