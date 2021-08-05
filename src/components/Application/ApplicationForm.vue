<template>
  <v-container>
    <div>
    <div id="dashboard-container" class="d-flex flex-row mb-6 align-center">
      <div id="rightSideDashboard">
        <v-img
          src="@/assets/sparky.png"
          max-height="75"
          max-width="75"
          class="db-logo"
        >
        </v-img>
        <div id="navigations">
          <v-btn elevation="0" class="nav-btn" @click="updatePageBody(0)">
            Dashboard</v-btn
          >
          <v-btn elevation="0" class="nav-btn"> Applicants </v-btn>
          <v-btn elevation="0" class="nav-btn"> Reports </v-btn>
        </div>
      </div>
      <div id="main-actions">
        <v-btn class="main-action" elevation="0">
          <v-icon
            aria-hidden="false"
            style="color: #36bd90"
            @click="updatePageBody(2)"
          >
            mdi-cog
          </v-icon>
        </v-btn>
        <v-btn class="main-action" elevation="0">
          <v-icon
            aria-hidden="false"
            style="color: #36bd90"
            @click="updatePageBody(3)"
          >
            mdi-bell
          </v-icon>
        </v-btn>
        <v-btn class="main-action" elevation="0" @click="updatePageBody(1)">
          <v-icon aria-hidden="false" style="color: #36bd90">
            mdi-account-circle
          </v-icon>
          &nbsp; &nbsp; {{ this.user.displayName }}
        </v-btn>
      </div>
    </div>
  </div>
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

    <FormulateForm class="form-wrapper" v-model="values" :schema="schema" />
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
      search: null,
      valid: false
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
    },
    deleteField(value) {
      this.schema = value;
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
    }
  },
  async mounted() {
    this.applicationType = await this.$route.params.applicationTypeFromList;
    this.semester = await this.$route.params.semesterFromList;
    this.schema = await this.$route.params.schemaList;
    this.dateFormatted = await this.$route.params.deadline;
    this.date = this.parseDate(this.dateFormatted);
  }
};
</script>

<style scoped>
/* .formulate-input-element .formulate-input-element--group .formulate-input-group {
        width: 100%;
    }
    
    .formulate-input-group-repeatable {
        width: 100%;
    } */

.form-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2em;
  border: 1px solid #a8a8a8;
  border-radius: 0.5em;
  box-sizing: border-box;
  color: rgb(110, 108, 108);
  background-color: rgb(229, 243, 250);
}

.test {
  display: felx;
  flex-direction: row;
  background-color: black;
}

.double-row {
  width: 700px;
  color: aqua;
}
@media (min-width: 650px) {
  .double-row {
    display: flex;
  }
}

@media (min-width: 720px) {
  .double-row {
    display: block;
  }
}

@media (min-width: 850px) {
  .double-row {
    display: flex;
  }
  .double-row .formulate-input {
    margin-right: 1.5em;
  }
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
