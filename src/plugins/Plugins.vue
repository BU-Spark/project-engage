<template>
  <div>
    <!-- admin chooses a question type -->
    <v-select
      :items="items"
      v-model="itemSelected"
      v-on:change="eraseFields"
      label="Type of question to add to the form"
      outlined
    ></v-select>

    <!-- fields required for "Input Field" -->
    <v-col cols="12" sm="12" md="3" v-if="this.itemSelected == 'Input Field'">
      <v-text-field label="Label" v-model="labelInput" outlined></v-text-field>
      <v-text-field label="Name" v-model="nameInput" outlined></v-text-field>
      <v-checkbox
        v-model="validationInput"
        :label="`Required field? ${validationInput.toString()}`"
      ></v-checkbox>
    </v-col>

    <!-- fields required for "Dropdown Options" -->
    <v-col
      cols="12"
      sm="12"
      md="3"
      v-if="this.itemSelected == 'Dropdown Options'"
    >
      <v-text-field
        label="Label"
        v-model="labelDropdown"
        outlined
      ></v-text-field>
      <v-text-field label="Name" v-model="nameDropdown" outlined></v-text-field>
      <v-checkbox
        v-model="validationDropdown"
        :label="`Required field? ${validationDropdown.toString()}`"
      ></v-checkbox>
      <v-text-field
        label="Add Option"
        v-model="addOptionDropdown"
        outlined
      ></v-text-field>
      <v-btn @click="addOptionDropdownFunc()">Add Option</v-btn>
      <div>
        Options entered:
      </div>
      <ul>
        <li v-for="option in optionsDropdown" :key="option">
          {{ option }}
          <v-btn @click="removeOptionDropdownFunc(option)">remove</v-btn>
        </li>
      </ul>
    </v-col>
  </div>
</template>

<script>
export default {
  name: "Plugins",
  components: {},
  data() {
    return {
      // types of questions the admin can select to add to the form
      items: [
        "Title",
        "Input Field",
        "Dropdown Options",
        "Multi-Select Combobox"
      ],
      itemSelected: null,
      // fields required for "Input Field"
      labelInput: null,
      nameInput: null,
      validationInput: false,
      // fields required for "Dropdown Options"
      labelDropdown: null,
      nameDropdown: null,
      validationDropdown: false,
      addOptionDropdown: null,
      optionsDropdown: []
    };
  },
  computed: {},
  methods: {
    // remove all field values when admin switches a question type
    eraseFields() {
      this.labelInput = null;
      this.nameInput = null;
      this.validationInput = false;
      this.labelDropdown = null;
      this.nameDropdown = null;
      this.validationDropdown = false;
      this.addOptionDropdown = null;
      this.optionsDropdown = [];
    },
    // functions for fields required for "Dropdown Options"
    addOptionDropdownFunc() {
      if (this.addOptionDropdown != null && this.addOptionDropdown != "") {
        this.optionsDropdown.push(this.addOptionDropdown);
        this.addOptionDropdown = null;
      }
    },
    removeOptionDropdownFunc: function(option) {
      this.optionsDropdown.splice(this.optionsDropdown.indexOf(option), 1);
    }
  }
};
</script>
