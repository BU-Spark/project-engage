<template>
  <div id="main-container">
    <h2 style="padding-bottom: 10px">{{ this.type }}</h2>
    <div v-if="baseProfile">
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
          <v-row no-gutters>
            <v-stepper-content
              v-for="n in steps"
              :key="`${n}-content`"
              :step="n"
            >
              <v-row>
                <v-col
                  cols="12"
                  md="4"
                  v-for="(value, i) in filterInfo(information, n)"
                  :key="i"
                >
                  <v-card
                    id="card-component"
                    v-if="value['status'] == status[n - 1]"
                  >
                    <v-row>
                      <v-card-title id="card-title">
                        {{ value["type"] }}
                      </v-card-title>
                    </v-row>
                    <v-card-text id="card-date">
                      For: {{ value["semester"] }}
                    </v-card-text>
                    <!-- Change when due date and text components are added -->
                    <v-card-subtitle id="card-date">
                      Deadline: {{ value["deadline"] }}
                    </v-card-subtitle>
                    <v-card-text id="app-desc">
                      {{ value["description"] }}
                    </v-card-text>
                    <v-card-text v-if="value['status'] != 'new'" id="card-date">
                      Submission Date: {{ value["submissionTime"] }}
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        raised
                        id="resume-btn"
                        @click="
                          resumeApplication(
                            value['type'],
                            value['semester'],
                            value['status']
                          )
                        "
                      >
                        {{ actions[n - 1] }}
                        <v-icon aria-hidden="false" id="resume-app-btn"
                          >mdi-arrow-right-drop-circle</v-icon
                        >
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-stepper-content>
          </v-row>
        </v-stepper-items>
      </v-stepper>
      <div v-else>
        <StudentApplication
          v-bind:type="type"
          v-bind:semester="semester"
          v-bind:status="statusInd"
          v-on:typeChange="changeType($event)"
        />
      </div>
    </div>
    <div v-else class="title">
      <h2>
        Please fill out your Spark! Student Profile first before you can submit
        applications!
      </h2>
      <h3>(upper left hand corner)</h3>
    </div>
  </div>
</template>
<script>
import { db } from "@/firebase/init.js";
import StudentApplication from "@/components/Student/StudentApplication.vue";
export default {
  components: {
    StudentApplication,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  data() {
    return {
      e1: 1,
      steps: 3,
      information: [],
      deadlines: {},
      descriptions: {},
      status: ["new", "started", "submitted"],
      actions: ["Start", "Resume", "View"],
      semester: null,
      semester1: null,
      semester2: null,
      type: null,
      statusInd: null,
      baseProfile: false,
    };
  },

  watch: {
    steps(val) {
      if (this.e1 > val) {
        this.e1 = val;
      }
    },
  },

  methods: {
    changeType(x) {
      this.type = x;
    },
    nextStep(n) {
      if (n === this.steps) {
        this.e1 = 1;
      } else {
        this.e1 = n + 1;
      }
    },
    resumeApplication(type, semester, status) {
      this.type = type;
      this.semester = semester;
      this.statusInd = status;
    },
    async retreiveApplicationTemplate(type) {
      //grab deadlines from templates
      const formRef = db.collection("applicationTemplate").doc(type);
      const formSnapshot = await formRef.get();
      return formSnapshot.data();
    },
    filterInfo(info, n) {
      var infoList = [];
      var statusPage = this.status[n - 1];
      for (var i = 0; i < info.length; i++) {
        if (info[i].status == statusPage) {
          infoList.push(info[i]);
        }
      }
      return infoList;
    },
  },
  async mounted() {
    //get current semester - need confirm what is the date cycle for applications!!!
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    var semList = [];
    if (month >= 10 || month <= 2) {
      // Spring application: Oct - Feb
      semList.push("Spring " + (year + 1));
    } else if (month >= 1 && month <= 5) {
      // Summer application: Jan - May
      semList.push("Summer " + year);
    } else if (month >= 4 && month <= 8) {
      // Fall application: Apr - Aug
      semList.push("Fall " + year);
    }
    //check if user base profile is complete
    const base = await db
      .collection("applications")
      .doc("Base")
      .collection("All")
      .doc(this.user.uid)
      .get();
    if (!base.exists) {
      this.baseProfile = false;
    } else {
      this.baseProfile = true;
    }

    //grab user application inputs
    const userRef = db.collection("users").doc(this.user.uid);
    const doc = await userRef.get();
    const apps = doc.data().applications;
    var tempList = [];
    var startedsubmittedList = [];
    var timeSubmitted = [];

    if (apps) {
      await Object.keys(apps).forEach(async function (key) {
        await apps[key].forEach(async (element) => {
          if (element.type != "Template") {
            var time = "";
            if (
              element.submissionTime != undefined &&
              element.status != "new"
            ) {
              time = new Date(element.submissionTime.seconds * 1000);
              time =
                time.getFullYear() +
                "-" +
                (time.getMonth() + 1) +
                "-" +
                time.getDate();
            }
            var temp = {
              semester: key,
              status: element.status,
              type: element.type,
              submissionTime: time,
            };
            startedsubmittedList.push(JSON.stringify(temp));
            timeSubmitted.push({
              semester: key,
              type: element.type,
              time: time,
            });
          }
        });
      });
    }
    const applications = [
      "Employment Opportunities",
      "Innovation Fellowship | Innovator",
      "Innovation Fellowship | Technical Teammate",
      "Innovation Fellowship | UX Designer",
      "Justice Media Co-Lab",
    ];
    await applications.forEach(async (element) => {
      let template = await this.retreiveApplicationTemplate(element);
      for (const sem of semList) {
        const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var monthTemp = month < 10 ? "0" + month : month;
        const currDate = year + "-" + monthTemp + "-" + day;
        if (
          template[sem] &&
          sem != "Template" &&
          template[sem]["deadline"] >= currDate
        ) {
          let currentDeadline = template[sem]["deadline"];
          let currentDescription = template[sem]["description"];
          var time = timeSubmitted.filter(function (v) {
            return v.semester == sem && v.type == element;
          });
          if (time.length > 0) {
            time = time[0]["time"];
          } else {
            time = "";
          }
          var isStarted = startedsubmittedList.includes(
            JSON.stringify({
              semester: sem,
              status: "started",
              type: element,
              submissionTime: time,
            })
          );
          var isSubmitted = startedsubmittedList.includes(
            JSON.stringify({
              semester: sem,
              status: "submitted",
              type: element,
              submissionTime: time,
            })
          );
          if (isStarted) {
            tempList.push({
              type: element,
              deadline: currentDeadline,
              description: currentDescription,
              status: "started",
              semester: sem,
              submissionTime: time,
            });
          }
          if (isSubmitted) {
            tempList.push({
              type: element,
              deadline: currentDeadline,
              description: currentDescription,
              status: "submitted",
              semester: sem,
              submissionTime: time,
            });
          }
          if (!isStarted && !isSubmitted) {
            tempList.push({
              type: element,
              deadline: currentDeadline,
              description: currentDescription,
              status: "new",
              semester: sem,
              submissionTime: time,
            });
          }
        }
      }
    });
    this.information = tempList;
  },
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
  margin-top: 2vh;
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
  border-radius: 40px;
  padding: 2px 2px 2px 2px;
  margin: 2% 2% 2% 2%;
}

#card-component:hover {
  box-shadow: 0 0 20px #36bd90;
}

#app-desc {
  text-overflow: ellipsis;
  margin-left: 2%;
  margin-right: 2%;
}

#card-title {
  line-height: 110%;
  margin-top: 5%;
  margin-left: 2%;
  margin-right: 2%;
  text-align: center;
  word-break: normal;
  font-weight: bold;
}

#card-date {
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  height: 20px;
  margin-bottom: 15px;
  margin-top: -15px;
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
  margin-bottom: 2%;
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
.title {
  margin-top: 15%;
}
</style>
