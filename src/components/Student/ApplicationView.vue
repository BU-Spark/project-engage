<template>
  <div id="main-container">
    <v-stepper v-model="e1" v-if="!type" class="stepperColor" :flat="true">
      <v-stepper-header>
        <template v-for="n in steps">
          <v-stepper-step
            :key="`${n}-step`"
            :complete="e1 > n"
            :step="n"
            editable
          >
            {{ status[n - 1] }}
          </v-stepper-step>

          <v-divider v-if="n !== steps" :key="n"></v-divider>
        </template>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
          <div
            id="app-list"
            v-bind:class="
              applications[status[n - 1]].length >= 4
                ? 'full-row'
                : 'not-full-row'
            "
            class="mt-4"
          >
            <v-card
              v-for="app in applications[status[n - 1]]"
              :key="app"
              id="card-component"
            >
              <v-card-title id="card-title">
                {{ app }}
              </v-card-title>
              <!-- Change when due date and text components are added -->
              <v-card-subtitle id="card-date">
                {{ deadlines[app] }}
              </v-card-subtitle>
              <v-card-text id="app-desc">
                More info coming soon!
              </v-card-text>
              <v-card-actions v-if="n < 3">
                <v-btn raised id="resume-btn" @click="resumeApplication(app)">
                  {{ actions[n - 1] }}
                  <v-icon aria-hidden="false" id="resume-app-btn"
                    >mdi-arrow-right-drop-circle</v-icon
                  >
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <div v-else>
      <StudentApplication v-bind:type="type" v-bind:semester="semester" />
    </div>
  </div>
</template>
<script>
import { db } from "@/firebase/init.js";
import StudentApplication from "@/components/Student/StudentApplication.vue";
export default {
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
      e1: 1,
      steps: 3,
      applications: {
        new: [
          "Employment Opportunities",
          "Innovation Fellowship | Innovator",
          "Innovation Fellowship | Technical Teammate",
          "Innovation Fellowship | UX Designer",
          "Justice Media Co-Lab"
        ],
        started: [],
        submitted: []
      },
      deadlines: {},
      status: ["new", "started", "submitted"],
      actions: ["Start", "Resume"],
      semester: null,
      type: null
    };
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    }
  },

  methods: {
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    resumeApplication(type) {
      this.type = type;
    },
    async retreiveApplicationTemplate(type) {
      //grab deadlines from templates
      const formRef = db.collection("applicationTemplate").doc(type);
      const formSnapshot = await formRef.get();
      return formSnapshot.data();
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

    //grab user application inputs
    const userRef = db.collection("users").doc(this.user.uid);
    const doc = await userRef.get();
    if (doc.data().applications) {
      doc.data().applications[this.semester].forEach(async element => {
        let template = await this.retreiveApplicationTemplate(element.type);
        let currentDeadline = template["Template"]["deadline"];
        if (element.status == "started") {
          this.applications.started.push(element.type);
        } else {
          this.applications.submitted.push(element.type);
        }
        const index = this.applications.new.indexOf(element.type);
        this.applications.new.splice(index, index + 1);
        this.deadlines[element.type] = currentDeadline;
      });
    }

    this.applications.new.forEach(async element => {
      let template = await this.retreiveApplicationTemplate(element);
      let currentDeadline = template["Template"]["deadline"];
      this.deadlines[element] = currentDeadline;
    });
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
  height: 30vh;
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
  margin-top: 5%;
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
.stepperColor {
  background-color: #e3eee5;
  border-radius: 2.5em;
}
</style>
