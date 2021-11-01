<template>
  <div>
    <div v-if="!loading">
      <v-stepper v-model="section" vertical>
        <div class="project-card">
          <div class="project-title">{{ this.type }}</div>
          <div class="project-deadline">Due Thursday, February 4th, 2021</div>
          <div class="project-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
              @submit="submitProfile"
            />
          </v-stepper-content>
        </template>
      </v-stepper>
      <v-btn
        class="my-2"
        @click="true"
        style="background-color: #00A99E; color: white;"
      >
        Submit
      </v-btn>
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
import { db } from "@/firebase/init.js";
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
      section: 1
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    async submitProfile() {
      this.loading = true;
      this.values.program = this.type;
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
              status: "started"
            })
          : console.log("application exisited");
      } else {
        applications = {};
        applications[this.semester] = [];
        applications[this.semester].push({
          type: this.type,
          status: "started"
        });
      }
      console.log(applications);
      await userRef.update({
        applications: applications
      });
      this.$router.go();
    }
  },
  async mounted() {
    //grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.type);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    this.schema = template["Template"]["schema"];
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
    console.log("hello", this.type);
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

.formulate-input .formulate-input-label {
  margin: auto;
}

.v-input.v-textarea.theme--light.v-text-field.v-text-field--is-booted.formulate-input-element.formulate-input-element--textarea {
  margin: auto;
}

.formulate-input-element.formulate-input-element--select {
  margin: auto;
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

.formulate-input .formulate-input-errors {
  margin: auto !important;
}
</style>
