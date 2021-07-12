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
    <v-container
      class="grey lighten-5"
      v-if="this.itemSelected == 'Input Field'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelInput"
            outlined
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="nameInput"
            outlined
          ></v-text-field>
          <v-checkbox
            v-model="validationInput"
            :label="`Required field? ${validationInput.toString()}`"
          ></v-checkbox>
        </v-col>
        <!-- View FormulateInput "Input Field" UI -->
        <v-col cols="12" sm="6">
          <v-row justify="center">
            <FormulateInput
              type="text"
              :label="`${labelInput}`"
              :validation="`${checkValidation(validationInput)}`"
              v-model="tempInput"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- fields required for "Dropdown Options" -->
    <v-container
      class="grey lighten-5"
      v-if="this.itemSelected == 'Dropdown Options'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelDropdown"
            outlined
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="nameDropdown"
            outlined
          ></v-text-field>
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
        <!-- View FormulateInput "Dropdown Options" UI -->
        <v-col cols="12" sm="6">
          <v-row justify="center">
            <FormulateInput
              type="select"
              :label="`${labelDropdown}`"
              :options="optionsDropdown"
              :validation="`${checkValidation(validationDropdown)}`"
              v-model="tempDropdown"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- fields required for "Multi-Select Combobox" -->
    <v-container
      class="grey lighten-5"
      v-if="this.itemSelected == 'Multi-Select Combobox'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelCombobox"
            outlined
          ></v-text-field>
          <v-text-field
            label="Placeholder"
            v-model="placeholderCombobox"
            outlined
          ></v-text-field>
          <v-text-field
            label="Name"
            v-model="nameCombobox"
            outlined
          ></v-text-field>
          <v-checkbox
            v-model="validationCombobox"
            :label="`Required field? ${validationCombobox.toString()}`"
          ></v-checkbox>
          <v-text-field
            label="Add Item"
            v-model="addItemCombobox"
            outlined
          ></v-text-field>
          <v-btn @click="addItemComboboxFunc()">Add Item</v-btn>
          <div>
            Items entered:
          </div>
          <ul>
            <li v-for="item in itemsCombobox" :key="item">
              {{ item }}
              <v-btn @click="removeItemComboboxFunc(item)">remove</v-btn>
            </li>
          </ul>
        </v-col>
        <!-- View FormulateInput "Multi-Select Combobox" UI -->
        <v-col cols="12" sm="6">
          <v-row justify="center">
            <FormulateInput
              type="combobox"
              :label="`${labelCombobox}`"
              :placeholder="`${placeholderCombobox}`"
              :items="itemsCombobox"
              :validation="`${checkValidation(validationCombobox)}`"
              v-model="tempCombobox"
            />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
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
      tempInput: null,
      // fields required for "Dropdown Options"
      labelDropdown: null,
      nameDropdown: null,
      validationDropdown: false,
      addOptionDropdown: null,
      optionsDropdown: [],
      tempDropdown: null,
      // fields required for "Multi-Select Combobox"
      labelCombobox: null,
      placeholderCombobox: null,
      nameCombobox: null,
      validationCombobox: false,
      addItemCombobox: null,
      itemsCombobox: [],
      tempCombobox: null
    };
  },
  computed: {},
  methods: {
    checkValidation(variable) {
      if (variable) {
        return "required";
      } else {
        return "";
      }
    },
    // remove all field values when admin switches a question type
    eraseFields() {
      this.labelInput = null;
      this.nameInput = null;
      this.validationInput = false;
      this.tempInput = null;
      this.labelDropdown = null;
      this.nameDropdown = null;
      this.validationDropdown = false;
      this.addOptionDropdown = null;
      this.optionsDropdown = [];
      this.tempDropdown = [];
      this.labelCombobox = null;
      this.placeholderCombobox = null;
      this.nameCombobox = null;
      this.validationCombobox = false;
      this.addItemCombobox = null;
      this.itemsCombobox = [];
      this.tempCombobox = [];
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
    },
    // functions for fields required for "Multi-Select Combobox"
    addItemComboboxFunc() {
      if (this.addItemCombobox != null && this.addItemCombobox != "") {
        this.itemsCombobox.push(this.addItemCombobox);
        this.addItemCombobox = null;
      }
    },
    removeItemComboboxFunc: function(item) {
      this.itemsCombobox.splice(this.itemsCombobox.indexOf(item), 1);
    }
  }
};
</script>
