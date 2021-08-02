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
