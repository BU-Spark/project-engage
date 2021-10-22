<template>
  <div id="main-container">
    <div v-if="!apps">
      <!-- When no applications are started -->
      <div id="app-container" v-if="applications.length == 0">
        <p id="app-title">No applications in progress</p>
        <span> Check out the application tag </span>
      </div>
      <div v-else-if="!type">
        <!-- List of different applications -->
        <p id="app-title">Choose an Application to Resume</p>
        <div
          id="app-list"
          v-bind:class="applications.length >= 4 ? 'full-row' : 'not-full-row'"
        >
          <v-card
            v-for="application in applications"
            :key="application"
            id="card-component"
          >
            <v-card-title id="card-title">
              {{ application.type }}
            </v-card-title>
            <!-- Change when due date and text components are added -->
            <v-card-subtitle id="card-date">
              Due Thursday, February 4th, 2021
            </v-card-subtitle>
            <v-card-text id="app-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </v-card-text>
            <v-card-actions>
              <v-btn
                raised
                id="resume-btn"
                @click="resumeApplication(application)"
              >
                Resume
                <v-icon aria-hidden="false" id="resume-app-btn"
                  >mdi-arrow-right-drop-circle</v-icon
                >
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </div>
    <!-- Resuming the a particular application -->
    <div v-if="type">
      <StudentApplication v-bind:type="type" v-bind:semester="semester" />
    </div>
    <v-btn class="my-2" v-if="apps" @click="apps = false"> Back </v-btn>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
import StudentApplication from "@/components/Student/StudentApplication.vue";
export default {
  name: "Apps",
  props: ["type"],
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
      newApplications: [
        "Employment Opportunities",
        "Innovation Fellowship | Innovator",
        "Innovation Fellowship | Technical Teammate",
        "Innovation Fellowship | UX Designer",
        "Justice Media Co-Lab"
      ],
      // temporary applications for design purposes
      applications: [],
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
    //grab application status of user
    const userBaseRef = db.collection("users").doc(this.user.uid);
    const doc = await userBaseRef.get();
    if (doc.data().applications && doc.data().applications[this.semester]) {
      this.applications = doc.data().applications[this.semester];
      doc.data().applications[this.semester].forEach(element => {
        const index = this.newApplications.indexOf(element.type);
        this.newApplications.splice(index, index + 1);
      });
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
  border-radius: 60px;
  background-color: #e3eee5;
  color: black;
  font-weight: 750;
  padding: 25px;
  min-height: 570px !important;
  text-align: center;
  min-height: 70vh;
  margin-top: 5vh;
  margin-left: 2vw;
  margin-right: 2vw;
}

#new-app-btn {
  box-shadow: none;
  background-color: #e3eee5;
  font-size: 40px;
  letter-spacing: 0px;
  text-transform: none;
  font-weight: bold;
}

#new-app-btn:hover {
  background-color: #e3eee5;
}

.appBtn {
  text-align: left;
  width: 100%;
}

#start-app-btn {
  color: #36bd90;
  font-size: 40px;
  margin-left: 10px;
}

#app-title {
  margin-top: 3vh;
  font-size: 40px;
}

#app-container {
  margin-top: 15%;
}

.full-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.not-full-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

#card-component {
  display: flex 0 0 25%;
  flex-direction: column;
  width: 20vw;
  height: 50vh;
  margin-right: 2.5vh;
  margin-left: 2.5vh;
  margin-bottom: 20px;
  border-radius: 40px;
  text-align: left;
  white-space: pre-line;
  overflow-wrap: normal;
  padding-left: 10px;
}

#card-component:hover {
  box-shadow: 0 0 20px #36bd90;
}

#app-desc {
  text-overflow: ellipsis;
}

#card-title {
  line-height: 110%;
  height: 20%;
  margin-top: 2%;
  padding-top: 5%;
  word-break: normal;
  font-weight: bold;
}

#card-date {
  height: 5%;
  margin-bottom: 5%;
}

#resume-btn {
  box-shadow: none;
  background-color: white;
  letter-spacing: 2px;
  text-transform: none;
  font-weight: bold;
  margin: auto;
  border-radius: 30px;
  box-shadow: 0 1px 5px;
  margin-bottom: 15px;
  width: 50%;
}

#resume-app-btn {
  color: #36bd90;
  font-size: 25px;
  margin-left: 5px;
}

.form-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2em;
  border: 2px solid rgba(200, 200, 200, 0.1);
  border-radius: 2.5em;
  box-sizing: border-box;
  background-color: #f1f8f3;
}

.stepperColor {
  background-color: #f1f8f3;
  border-radius: 2.5em;
}
</style>
