<template>
  <div>
    <div v-if="!loading">
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
              @submit="saveProfile"
            />
          </v-stepper-content>
        </template>
      </v-stepper>
      <v-btn
        class="my-2"
        @click="submitProfile"
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
    async saveProfile() {
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
      await userRef.update({
        applications: applications
      });
      this.$router.go();
    },
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
              status: "submitted"
            })
          : applications[this.semester].push({
              type: this.type,
              status: "submitted"
            });
      } else {
        applications = {};
        applications[this.semester] = [];
        applications[this.semester].push({
          type: this.type,
          status: "submitted"
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
