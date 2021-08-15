<template>
  <div id="main-container">
    <div v-if="!apps">
      <div v-if="applications.length == 0">
        <h1>No Applications in Progress <br /></h1>
        <br />
      </div>
      <div v-else>
        <v-card
          v-for="application in applications"
          :key="application"
          class="ma-auto mb-2"
          max-width="344"
        >
          <v-card-title>
            {{ application }}
          </v-card-title>
          <v-card-actions>
            <v-btn color="teal" @click="resumeApplication(application)">
              Resume Application</v-btn
            >
          </v-card-actions>
        </v-card>
      </div>
      <h1>
        <v-btn className="new-app-btn" @click="startNewApp()">
          Start New Application
          <v-icon aria-hidden="false" style="color:#36BD90"
            >mdi-arrow-right-drop-circle</v-icon
          >
        </v-btn>
      </h1>
    </div>
    <div v-else-if="resume">
      <StudentApplication v-bind:type="type" v-bind:semester="semester" />
    </div>
    <div v-else>
      <ul v-for="newApp in newApplications" :key="newApp">
        <v-btn class="appBtn" @click="resumeApplication(newApp)">
          Start {{ newApp }} Application
        </v-btn>
      </ul>
    </div>
    <v-btn class="my-2" v-if="apps" @click="apps = false"> Back </v-btn>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
import StudentApplication from "@/components/Student/StudentApplication.vue";
export default {
  name: "Apps",
  // props: ["currentPage"],
  components: {
    StudentApplication
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data() {
    return {
      apps: false,
      resume: false,
      programList: [
        "Employment Opportunities",
        "Innovation Fellowship | Innovator",
        "Innovation Fellowship | Technical Teammate",
        "Innovation Fellowship | UX Designer",
        "Justice Media Co-Lab",
        "X-Lab"
      ],
      applications: [],
      type: null,
      newApplications: [],
      semester: null
    };
  },
  methods: {
    resumeApplication(type) {
      this.apps = true;
      this.resume = true;
      this.type = type;
    },
    startNewApp() {
      this.apps = true;
      this.resume = false;
    }
  },
  async mounted() {
    //grab application status of user
    const userBaseRef = db.collection("users").doc(this.user.uid);
    const doc = await userBaseRef.get();
    if (doc.data().applications) {
      this.applications = doc.data().applications;
    }
    this.newApplications = this.programList.filter(
      x => !this.applications.includes(x)
    );

    //get current semester - need confirm what is the date cycle for applications!!!
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();
    if (month >= 7 && month <= 11) {
      this.semester = "Fall " + year;
    } else if (month >= 0 && month <= 4) {
      this.semester = "Spring " + year;
    } else {
      this.semester = "Summer " + year;
    }
  }
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
.appBtn {
  text-align: left;
  width: 100%;
}
</style>
