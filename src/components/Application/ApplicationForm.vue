<template>
  <v-container>
    <h2>Application Form for {{ this.applicationType }} program</h2>
    <h2>Semester: {{ this.semester }}</h2>

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
  name: "BaseApplicationForm",
  components: {
    AddItem,
    DeleteItem
  },
  data() {
    return {
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
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
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
          [`${this.semester}.deadline`]: ""
        })
        .then(() => {
          console.log("submitted");
        })
        .catch(error => {
          console.log(error);
        });
      alert("You have successfully updated the form");
      this.$router.push("/applicationFormList");
    }
  },
  async mounted() {
    this.applicationType = await this.$route.params.applicationTypeFromList;
    this.semester = await this.$route.params.semesterFromList;
    this.schema = await this.$route.params.schemaList;
  }
};
</script>
