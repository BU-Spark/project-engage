<template>
  <div>
    <div v-if="!loading">
      <!-- application questions and save application option -->
      <v-stepper v-model="section" vertical>
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
  props: ["type", "semester"],
  data() {
    return {
      schema: [],
      schemaList: [],
      values: null,
      userBaseRef: null,
      loading: false,
      steps: [],
      section: 1,
      dialog: false
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
      await this.userBaseRef.set(this.values);
      const userRef = db.collection("users").doc(this.user.uid);
      const doc = await userRef.get();
      var applications = null;
      if (doc.data().applications) {
        applications = doc.data().applications;
        if (!doc.data().applications[this.semester]) {
          applications[this.semester] = [];
        }
        applications[this.semester].some(x => {
          return x.type == this.type;
        }) === false
          ? applications[this.semester].push({
              type: this.type,
              status: "started",
              submissionTime: new Date()
            })
          : console.log("application exisited");
      } else {
        applications = {};
        applications[this.semester] = [];
        applications[this.semester].push({
          type: this.type,
          status: "started",
          submissionTime: new Date()
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
          this.schema[i]["type"] != "file"
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
        await this.userBaseRef.set(this.values);
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
        await userRef.update({
          applications: applications
        });
        this.$router.go();
      }
    }
  },
  async mounted() {
    //grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.type);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template[this.semester]["schema"];
    var temp = [];
    for (let i = 0; i < this.schema.length; i++) {
      if (this.schema[i]["type"] == "hr") {
        this.schemaList.push(temp);
        this.steps.push(this.schema[i]["label"]);
        temp = [];
      } else {
        temp.push(this.schema[i]);
      }
    }
    this.schemaList.push(temp);
    this.schemaList = this.schemaList.filter(e => e.length);
    //grab user application inputs
    this.userBaseRef = db
      .collection("applications")
      .doc(this.semester)
      .collection(this.type)
      .doc(this.user.uid);
    const doc = await this.userBaseRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      this.values = doc.data();
      console.log("Document data:", doc.data());
    }
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
</style>
