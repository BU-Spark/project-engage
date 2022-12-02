<!-- This template display the selected student application on the admin side -->
<template>
  <div>
    <div>
      <div
        style="display: flex; flex-direction: row; justify-content: space-between"
      >
        <span></span>
        <h3>Student Application</h3>
        <span>
          <router-link to="/studentAppExport" target="_blank">
            Print / Save as PDF
          </router-link>
        </span>
      </div>

      <!-- student info (same as the student profile, might consider making one component)-->
      <v-data-table
        :headers="headers"
        :items="information"
        :single-select="false"
        item-key="test"
        class="elevation-1"
        hide-default-footer
      ></v-data-table>

      <!-- application form display -->
      <div
        v-if="this.schema.length != 0 && steps[0] != 'Test'"
        style="margin-top: 30px;margin-bottom: 30px;"
      >
        <v-stepper v-model="section" vertical>
          <template v-for="(n, i) in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :complete="section > i"
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
              />
            </v-stepper-content>
          </template>
        </v-stepper>
      </div>
    </div>
    <h2 v-if="this.schema.length == 0" style="margin: 10px;">
      This application is no longer valid
    </h2>
  </div>
</template>

<script>
import { db } from "@/firebase/init.js";
// import "../../assets/print.css";
export default {
  name: "StudentApplication",
  props: ["item"],
  data() {
    return {
      headers: [
        {
          text: "Name",
          value: "name"
        },
        {
          text: "Semester",
          value: "semester"
        },
        {
          text: "Program",
          value: "program"
        },
        {
          text: "Year",
          value: "year"
        },
        {
          text: "Gender",
          value: "gender"
        },
        {
          text: "Email",
          value: "email"
        },
        {
          text: "Status",
          value: "status"
        },
        {
          text: "Notes",
          value: "notes"
        }
      ],
      information: [],
      schema: [],
      schemaList: [],
      values: null,
      userBaseRef: null,
      steps: ["Test"], // set dummy value to allow first section to open automatically
      section: 0,
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
    showPrintWindow() {
      window.print();
    }
  },
  async mounted() {
    let params = JSON.parse(localStorage["params"]);
    this.item = params["item"];
    //gather basic user information
    this.information = [
      {
        name: this.item.firstname + " " + this.item.lastname,
        semester: this.item.semester,
        program: this.item.program,
        year: this.item.schoolYear,
        gender: this.item.gender,
        email: this.item.email,
        status: this.item.status == 0 ? "Started" : "Submitted",
        notes: this.item.note
      }
    ];

    //grab user application inputs
    this.values = this.item;

    // grab application form template
    const formRef = db.collection("applicationTemplate").doc(this.item.program);
    const formSnapshot = await formRef.get();
    const template = formSnapshot.data();
    if (
      template[this.item.semester] &&
      template[this.item.semester]["schema"]
    ) {
      this.schema = template[this.item.semester]["schema"];
      var temp = [];
      for (let i = 0; i < this.schema.length; i++) {
        if (this.schema[i]["type"] == "hr") {
          this.schemaList.push(temp);
          this.steps.push(this.schema[i]["label"]);
          temp = [];
        } else if (
          this.item.status == 1 &&
          this.schema[i]["type"] == "submit"
        ) {
          // don't add the save button
        } else if (this.schema[i]["type"] == "file") {
          this.schema[i] = {
            label: this.schema[i]["label"],
            name: this.schema[i]["name"],
            type: "textarea"
          };
          if (this.values[this.schema[i]["name"]]) {
            var tempStr = "";
            for (
              var j = 0;
              j < this.values[this.schema[i]["name"]].length;
              j++
            ) {
              tempStr += this.values[this.schema[i]["name"]][j]["url"] + "\n";
            }
            this.values[this.schema[i]["name"]] = tempStr;
          }
          temp.push(this.schema[i]);
        } else {
          temp.push(this.schema[i]);
        }
      }
      this.schemaList.push(temp);
      this.schemaList = this.schemaList.filter(e => e.length);
      this.steps.shift(); // delete the dummy value
    }

    // Update the title after loaded
    document.title =
      this.item.firstname + " " + this.item.lastname + "-" + this.item.program;
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

@media print {
  .no-print {
    display: none;
  }
}
</style>
