<template>
  <div>
    <!-- admin chooses a question type -->
    <v-select
      :items="items"
      v-model="questionSelected"
      v-on:change="eraseFields"
      label="Type of question to add to the form"
      outlined
    ></v-select>

    <!-- fields required for "Input Field" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Input Field'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelInput"
            :rules="[() => !!labelInput || 'This field is required']"
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
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <FormulateInput
              type="text"
              :label="`${labelInput}`"
              :validation="`${checkValidation(validationInput)}`"
              v-model="tempInput"
            />
          </v-card>
          <v-select
            :items="schemaArray"
            item-text="label"
            v-model="itemSelected"
            v-validate="required"
            label="Choose where to add the question (before...)"
            :rules="[() => !!itemSelected || 'This field is required']"
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!-- fields required for "Dropdown Options" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Dropdown Options'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelDropdown"
            :rules="[() => !!labelDropdown || 'This field is required']"
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
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <FormulateInput
              type="select"
              :label="`${labelDropdown}`"
              :options="optionsDropdown"
              :validation="`${checkValidation(validationDropdown)}`"
              v-model="tempDropdown"
            />
          </v-card>
          <v-select
            :items="schemaArray"
            item-text="label"
            v-model="itemSelected"
            v-validate="required"
            label="Choose where to add the question (before...)"
            :rules="[() => !!itemSelected || 'This field is required']"
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <!-- fields required for "Multi-Select Combobox" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Multi-Select Combobox'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelCombobox"
            :rules="[() => !!labelCombobox || 'This field is required']"
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
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <FormulateInput
              type="combobox"
              :label="`${labelCombobox}`"
              :placeholder="`${placeholderCombobox}`"
              :items="itemsCombobox"
              :validation="`${checkValidation(validationCombobox)}`"
              v-model="tempCombobox"
            />
          </v-card>
          <v-select
            :items="schemaArray"
            item-text="label"
            v-model="itemSelected"
            v-validate="required"
            label="Choose where to add the question (before...)"
            :rules="[() => !!itemSelected || 'This field is required']"
            outlined
          ></v-select>
        </v-col>
      </v-row>
    </v-container>

    <v-btn @click="cancelItem()">Cancel</v-btn>
    <v-btn @click="addItem()">Confirm Add</v-btn>
  </div>
</template>

<script>
export default {
  name: "Plugins",
  components: {},
  props: {
    schema: Array
  },
  data() {
    return {
      // types of questions the admin can select to add to the form
      schemaArray: this.schema,
      itemSelected: null,
      items: ["Input Field", "Dropdown Options", "Multi-Select Combobox"],
      questionSelected: null,
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
      tempCombobox: null,
      itemSchema: null
    };
  },
  computed: {},
  methods: {
    addItem() {
      if (
        (!this.labelInput && !this.labelDropdown && !this.labelCombobox) ||
        (!this.itemSelected && this.schemaArray.length > 0)
      ) {
        alert(
          'Please fill in "Label" or select "Choose where to add the question"'
        );
      } else {
        if (this.questionSelected == this.items[0]) {
          this.itemSchema = {
            label: this.labelInput,
            name: this.nameInput,
            validation: this.validationInput ? "required" : ""
          };
        } else if (this.questionSelected == this.items[1]) {
          this.itemSchema = {
            label: this.labelDropdown,
            name: this.nameDropdown,
            type: "select",
            options: this.optionsDropdown,
            validation: this.validationDropdown ? "required" : ""
          };
        } else if (this.questionSelected == this.items[2]) {
          this.itemSchema = {
            label: this.labelCombobox,
            name: this.nameCombobox,
            type: "combobox",
            items: this.itemsCombobox,
            validation: this.validationCombobox ? "required" : "",
            placeholder: this.placeholderCombobox
          };
        }
        var index = this.schemaArray.findIndex(
          x => x.label === this.itemSelected
        );
        if (this.schemaArray.length <= 0) {
          this.schemaArray = [this.itemSchema];
        } else {
          this.schemaArray.splice(index, 0, this.itemSchema);
        }
        this.$emit("addItem", false);
        this.$emit("itemAdded", this.schemaArray);
        alert("You have successfully added an item!");
      }
    },
    cancelItem() {
      this.$emit("addItem", false);
    },
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
      this.itemSelected = null;
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
