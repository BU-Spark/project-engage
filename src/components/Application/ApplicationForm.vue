<template>
  <v-container>
    <h2>Application Form for {{ this.applicationType }} program</h2>
    <h2>Semester: {{ this.semester }}</h2>

    <!-- select deadline date -->
    <v-container>
      <v-row>
        <v-col cols="12" lg="6">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Deadline Date"
                hint="MM/DD/YYYY format (if no deadline, leave the input blank or delete everything in the box)"
                persistent-hint
                prepend-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              no-title
              @input="menu = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
    </v-container>

    <!-- delete / add item selection -->
    <DeleteItem
      v-if="this.deleteItem && !this.addItem"
      :schema="schema"
      @deleteItem="changeDeleteItemState()"
      @itemDeleted="deleteField"
    />
    <v-btn
      v-if="!this.deleteItem && !this.addItem"
      @click="changeDeleteItemState()"
      >Delete Item</v-btn
    >

    <AddItem
      v-if="this.addItem && !this.deleteItem"
      :schema="schema"
      @addItem="changeAddItemState()"
      @itemAdded="addField"
    />
    <v-btn
      v-if="!this.addItem && !this.deleteItem"
      @click="changeAddItemState()"
      >Add Item</v-btn
    >

    <!-- display form format -->
    <template>
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
            />
            <!-- <v-btn
              v-if="i < steps.length - 1"
              color="primary"
              @click="nextStep(n, 'continue')"
            >
              Continue
            </v-btn> -->
            <!-- <v-btn text v-if="i != 0" @click="nextStep(n, 'back')">
              Back
            </v-btn> -->
            <!-- <v-btn
              v-if="i == steps.length - 1"
              color="primary"
              @click="nextStep(n)"
            >
              Submit
            </v-btn> -->
          </v-stepper-content>
        </template>
      </v-stepper>
    </template>

    <!-- cancel to stop editing or submit to save template -->
    <v-btn @click="cancel">Cancel</v-btn>
    <v-btn @click="submitFormTemplate">Submit Form Template</v-btn>
  </v-container>
</template>

<script>
import { db } from "@/firebase/init";
import "@/assets/formulate.css";
import AddItem from "@/plugins/AddItem.vue";
import DeleteItem from "@/plugins/DeleteItem.vue";

export default {
  name: "ApplicationForm",
  components: {
    AddItem,
    DeleteItem
  },
  data() {
    return {
      date: "",
      dateFormatted: "",
      menu: false,
      addItem: false,
      deleteItem: false,
      value: {},
      applicationType: "",
      semester: "",
      schema: [],
      schemaList: [],
      search: null,
      valid: false,
      steps: [],
      section: 1
    };
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return null;
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    addField(value) {
      this.schema = value;
      this.schemaList = [];
      var temp = [];
      this.steps = [];
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
    },
    deleteField(value) {
      this.schema = value;
      this.schemaList = [];
      var temp = [];
      this.steps = [];
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
    },
    changeAddItemState() {
      this.addItem = !this.addItem;
      this.deleteItem = false;
    },
    changeDeleteItemState() {
      this.deleteItem = !this.deleteItem;
      this.addItem = false;
    },
    cancel() {
      this.$router.go(-1);
    },
    async submitFormTemplate() {
      const template = db
        .collection("applicationTemplate")
        .doc(this.applicationType);
      template
        .update({
          [`${this.semester}.schema`]: this.schema,
          [`${this.semester}.deadline`]: this.date
        })
        .then(() => {
          console.log("submitted");
        })
        .catch(error => {
          console.log(error);
        });
      alert("You have successfully updated the form");
      this.$router.go(-1);
    },
    nextStep(n, action) {
      if (action == "continue") {
        this.section = n + 1;
      } else if (action == "back") {
        this.section = n - 1;
      }
    }
  },
  async mounted() {
    this.applicationType = await this.$route.params.applicationTypeFromList;
    this.semester = await this.$route.params.semesterFromList;
    this.schema = await this.$route.params.schemaList;
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
    this.dateFormatted = await this.$route.params.deadline;
    this.date = this.parseDate(this.dateFormatted);
  }
};
</script>

<style scoped>
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

.test {
  display: flex;
  flex-direction: row;
  background-color: black;
}

.formulate-input {
  margin-right: 2em;
  margin-bottom: 0;
  color: black;
  background-color: white;
}

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
</style>
