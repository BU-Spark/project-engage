<template>
  <div>
    <div v-if="!loading">
      <!-- application questions and save application option -->
      <v-stepper v-model="section" vertical>
        <div class="project-card">
          <div class="project-title">{{ this.type }}</div>
          <div class="project-deadline">Due {{ this.deadline }}</div>
          <div class="project-description">
            {{ this.description }}
          </div>
        </div>
        <template v-for="(n, i) in steps">
          <v-stepper-step
            :key="`${n}-step`"
            :complete="section > n"
            :step="i"
            editable
            class="stepperColor"
          >
            {{ n }}
          </v-stepper-step>
          <v-stepper-content :key="`${n}-content`" :step="i">
            <FormulateForm
              class="form-wrapper"
              v-model="values"
              :schema="schemaList[i]"
              @submit="saveApplication"
            />
          </v-stepper-content>
        </template>
      </v-stepper>
      <v-col
        class="d-flex"
        cols="12"
        sm="6"
        v-if="type == 'Employment Opportunities' && status == 'submitted'"
      >
        <v-select
          :items="['Continue', 'Opt-Out']"
          label="Would you like to continue this offer for next semester?"
          v-model="empStatus"
        ></v-select>
      </v-col>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-row class="justify-center" style="padding-top: 2vh">
              <!-- back to applications list page -->
              <v-btn class="my-2" @click="goBack()">
                Back
              </v-btn>
              <div style="width: 2vh;"></div>
              <!-- submit application to pop up -->
              <v-btn
                class="my-2"
                v-bind="attrs"
                v-on="on"
                style="background-color: #00A99E; color: white;"
                v-if="
                  status != 'submitted' || type == 'Employment Opportunities'
                "
              >
                Submit
              </v-btn>
            </v-row>
          </template>
          <!-- submit application double confirmation pop up -->
          <v-card>
            <h4>
              Are you sure you want to submit the application? You would not be
              able to make modifications after submitting.
            </h4>
            <v-btn
              class="my-2"
              style="margin-right: 5px;"
              @click="dialog = false"
            >
              Back
            </v-btn>
            <!-- submit application -->
            <v-btn
              class="my-2"
              @click="submitApplication"
              style="background-color: #00A99E; color: white; margin-left: 5px;"
            >
              Confirm
            </v-btn>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <v-overlay v-if="loading">
      <div>
        <v-progress-circular
          :size="70"
          indeterminate
          color="green"
        ></v-progress-circular>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { db, storage } from "@/firebase/init.js";
export default {
  name: "StudentApplication",
  props: ["type", "semester", "status"],
  data() {
    return {
      schema: [],
      schemaList: [],
      values: null,
      applicationsRef: null,
      loading: false,
      steps: [],
      section: 1,
      dialog: false,
      deadline: "",
      description: "",
      empStatus: ""
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    goBack() {
      this.$emit("typeChange", null);
    },
    async processFiles(values) {
      // upload firebase storage for files
      var valuesCopy = Object.assign({}, values);
      Object.filter = (obj, predicate) =>
        Object.keys(obj)
          .filter(key => predicate(obj[key]))
          .reduce((res, key) => ((res[key] = obj[key]), res), {});
      var filtered = Object.filter(valuesCopy, value => value["files"] != null);
      var fileElements = Object.keys(filtered);
      for (var i = 0; i < fileElements.length; i++) {
        var temp = [];
        for (var j = 0; j < filtered[fileElements[i]]["files"].length; j++) {
          var name = valuesCopy[fileElements[i]]["files"][j]["path"]["name"];
          var url = await storage
            .ref()
            .child(
              this.user.uid +
                " " +
                this.type +
                " " +
                fileElements[i] +
                " " +
                j +
                "." +
                name.split(".").pop()
            )
            .put(valuesCopy[fileElements[i]]["files"][j]["file"])
            .then(snapshot => {
              return snapshot.ref.getDownloadURL();
            })
            .then(downloadURL => downloadURL);
          temp.push({
            name: name,
            url: url
          });
        }
        valuesCopy[fileElements[i]] = temp;
      }
      return valuesCopy;
    },
    async saveApplication() {
      this.loading = true;
      this.values.program = this.type;
      this.values = await this.processFiles(this.values);
      this.values["adminNotes"] = "";
      this.values["status"] = 0;
      await this.applicationsRef.set(this.values);
      const userRef = db.collection("users").doc(this.user.uid);
      const doc = await userRef.get();
      var applications = null;
      if (doc.data().applications) {
        applications = doc.data().applications;
        if (!doc.data().applications[this.semester]) {
          applications[this.semester] = [];
        }
        var temp = applications[this.semester].some(x => {
          return x.type == this.type;
        });
        if (temp === false) {
          applications[this.semester].push({
            type: this.type,
            status: "started",
            submissionTime: new Date()
          });
        } else {
          for (var i = 0; i < applications[this.semester].length; i++) {
            if (applications[this.semester][i]["type"] == this.type) {
              applications[this.semester][i] = {
                type: this.type,
                status: "started",
                submissionTime: new Date()
              };
            }
          }
        }
      } else {
        applications = {};
        applications[this.semester].push({
          type: this.type,
          status: "started",
          submissionTime: new Date()
        });
      }
      if (this.type == "Employment Opportunities") {
        await userRef.update({
          employmentOpportunitiesSubmission: {
            semester: this.semester,
            status: "started"
          }
        });
      }
      await userRef.update({
        applications: applications
      });
      this.$router.go();
    },
    async submitApplication() {
      var pass = true;
      for (var i = 0; i < this.schema.length; i++) {
        if (
          this.schema[i]["validation"] != undefined &&
          this.schema[i]["validation"] != null &&
          this.schema[i]["validation"] != "" &&
          this.schema[i]["type"] != "file" &&
          this.schema[i]["type"] != "image"
        ) {
          if (
            this.values[this.schema[i]["name"]] == "" ||
            this.values[this.schema[i]["name"]] == null
          ) {
            pass = false;
            break;
          }
        }
      }
      if (pass == false) {
        alert("Please fill out all required information!");
      } else {
        this.loading = true;
        this.values.program = this.type;
        this.values = await this.processFiles(this.values);
        this.values["adminNotes"] = "";
        this.values["status"] = 1;
        await this.applicationsRef.set(this.values);
        const userRef = db.collection("users").doc(this.user.uid);
        const doc = await userRef.get();
        var applications = null;
        if (doc.data().applications) {
          applications = doc.data().applications;
          if (!doc.data().applications[this.semester]) {
            applications[this.semester] = [];
          }
          var temp = applications[this.semester].some(x => {
            return x.type == this.type;
          });
          if (temp === false) {
            applications[this.semester].push({
              type: this.type,
              status: "submitted",
              submissionTime: new Date()
            });
          } else {
            for (i = 0; i < applications[this.semester].length; i++) {
              if (applications[this.semester][i]["type"] == this.type) {
                applications[this.semester][i] = {
                  type: this.type,
                  status: "submitted",
                  submissionTime: new Date()
                };
              }
            }
          }
        } else {
          applications = {};
          applications[this.semester].push({
            type: this.type,
            status: "submitted",
            submissionTime: new Date()
          });
        }
        if (this.type == "Employment Opportunities") {
          let status = "submitted";
          if (this.empStatus == "Continued") {
            status = "submitted";
          } else if (this.empStatus == "Opt-Out") {
            status = "opt-out";
            this.values["status"] = -1;
          } else {
            status = "submitted";
          }
          await userRef.update({
            employmentOpportunitiesSubmission: {
              semester: this.semester,
              status: status
            }
          });
        }
        await userRef.update({
          applications: applications
        });
        this.$router.go();
      }
    },
    reformatDeadline(deadline) {
      const year = deadline.substring(0, 4);
      const month = deadline.substring(5, 7) - 1;
      const day = deadline.substring(8, 10);
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return months[month] + " " + day + ", " + year;
    }
  },
  async mounted() {
    //grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.type);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template[this.semester]["schema"];
    var temp = [];
    this.deadline = this.reformatDeadline(template[this.semester]["deadline"]);
    this.description = template[this.semester]["description"];
    for (let i = 0; i < this.schema.length; i++) {
      if (this.schema[i]["type"] == "hr") {
        this.schemaList.push(temp);
        this.steps.push(this.schema[i]["label"]);
        temp = [];
      } else if (
        this.status == "submitted" &&
        this.schema[i]["type"] == "submit"
      ) {
        // don't add the save button
      } else {
        temp.push(this.schema[i]);
      }
    }
    this.schemaList.push(temp);
    this.schemaList = this.schemaList.filter(e => e.length);

    //grab user application inputs
    this.applicationsRef = db
      .collection("applications")
      .doc(this.semester)
      .collection(this.type)
      .doc(this.user.uid);
    const doc = await this.applicationsRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
    }
    console.log(this.values);
    console.log(this.schemaList);
  }
};
</script>

<style scoped>
div#main-actions {
  margin-right: 25px !important;
  float: right !important;
  right: -25px !important;
  padding: 15px !important;
  text-align: left !important;
}

v-btn {
  color: #36bd90;
}

.main-action {
  margin-right: 10px !important;
  border-radius: 15px;
  padding: 15px 0px;
}

div#dashboard-container {
  background-color: #36bd90;
  color: black;
  padding: 15px;
  width: 100%;
  justify-content: space-between;
}

div#rightSideDashboard {
  display: flex;
  justify-content: left;
  align-items: center;
}

.nav-btn {
  background-color: transparent !important;
  color: black !important;
  font-weight: 900 !important;
  border: none !important;
  /* font-size: 12px; */
}

.db-logo {
  margin: 5px 25px;
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

.project-card {
  display: flex;
  flex-direction: column;
  background-color: #f1f8f3;
  margin-bottom: 1rem;
  border-radius: 15px;
  -webkit-box-shadow: 0 4px 3px -3px black;
  -moz-box-shadow: 0 4px 3px -3px black;
  box-shadow: 0 4px 3px -3px black;
}

.project-title {
  font-weight: 900;
  font-size: 30px;
  text-align: left;
  padding-left: 3rem;
  padding-top: 3vh;
}

.project-deadline {
  font-weight: 850;
  text-align: left;
  padding-left: 3.1rem;
  margin-top: -1vh;
  margin-bottom: 1.5vh;
}

.project-description {
  text-align: left;
  padding-left: 3.1rem;
  padding-right: 3rem;
  padding-bottom: 3vh;
}
</style>

<style>
.formulate-input-element.formulate-input-element--submit {
  background-color: #f1f8f3 !important;
  justify-content: center !important;
}

.v-messages {
  background-color: #f1f8f3 !important;
}

.v-sheet.v-stepper:not(.v-sheet--outlined) {
  box-shadow: none;
}

button[id^="formulate--home"] {
  width: 50% !important;
  justify-content: center !important;
  margin: auto !important;
}

div[id^="formulate--home"] {
  width: 50% !important;
  justify-content: center !important;
  margin: auto !important;
}

.formulate-input .formulate-input-label {
  margin: auto;
}

.v-input.v-textarea.theme--light.v-text-field.v-text-field--is-booted.formulate-input-element.formulate-input-element--textarea {
  margin: auto;
}

.formulate-input-element {
  margin: auto;
}

.formulate-input .formulate-input-label {
  max-width: 100% !important;
  justify-content: center;
}

label[id^="formulate--home"] {
  width: 60% !important;
}

.formulate-input-element.formulate-input-element--submit {
  margin: auto;
  margin-top: 3rem !important;
}

.formulate-input-element.formulate-input-element--text {
  margin: auto;
}

.formulate-input .formulate-input-errors,
.v-input {
  margin: auto !important;
}

.formulate-input .formulate-input-element {
  max-width: 25em !important;
}
</style>
