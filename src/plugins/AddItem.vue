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

    <!-- fields required for "Paragraph" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Paragraph'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelParagraph"
            :rules="[() => !!labelParagraph || 'This field is required']"
            outlined
          ></v-text-field>
          <v-checkbox
            v-model="validationParagraph"
            :label="`Required field? ${validationParagraph.toString()}`"
          ></v-checkbox>
        </v-col>
        <!-- View FormulateInput "Input Field" UI -->
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <FormulateInput
              type="textarea"
              :label="`${labelParagraph}`"
              :validation="`${checkValidation(validationInput)}`"
              v-model="tempParagraph"
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

    <!-- fields required for "Select" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Select'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelDropdown"
            :rules="[() => !!labelDropdown || 'This field is required']"
            outlined
          ></v-text-field>
          <v-checkbox
            v-model="multipleDropdown"
            :label="`Multi-select? ${multipleDropdown.toString()}`"
          ></v-checkbox>
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
          <div>Options entered:</div>
          <ul>
            <li v-for="option in optionsDropdown" :key="option">
              {{ option }}
              <v-btn @click="removeOptionDropdownFunc(option)">remove</v-btn>
            </li>
          </ul>
        </v-col>
        <!-- View FormulateInput "Select" UI -->
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <div v-if="multipleDropdown">
              <FormulateInput
                type="select"
                :label="`${labelDropdown}`"
                :options="optionsDropdown"
                :validation="`${checkValidation(validationDropdown)}`"
                v-model="tempDropdown"
                multiple
              />
            </div>
            <div v-if="!multipleDropdown">
              <FormulateInput
                type="select"
                :label="`${labelDropdown}`"
                :options="optionsDropdown"
                :validation="`${checkValidation(validationDropdown)}`"
                v-model="tempDropdown"
              />
            </div>
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

    <!-- fields required for "Combobox" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'Combobox'"
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
          <div>Items entered:</div>
          <ul>
            <li v-for="item in itemsCombobox" :key="item">
              {{ item }}
              <v-btn @click="removeItemComboboxFunc(item)">remove</v-btn>
            </li>
          </ul>
        </v-col>
        <!-- View FormulateInput "Combobox" UI -->
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

    <!-- fields required for "File" -->
    <v-container class="grey lighten-5" v-if="this.questionSelected == 'File'">
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Label"
            v-model="labelFile"
            :rules="[() => !!labelFile || 'This field is required']"
            outlined
          ></v-text-field>
          <v-select
            :items="['image', 'file']"
            v-model="validationFile"
            label="Choose allowed file type"
            outlined
            :rules="[() => !!validationFile || 'This field is required']"
          ></v-select>
          <v-checkbox
            v-model="multipleFile"
            :label="`Allow multiple files? ${multipleFile.toString()}`"
          ></v-checkbox>
        </v-col>
        <!-- View FormulateInput "File" UI -->
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <div v-if="validationFile == 'file' && multipleFile">
              <FormulateInput
                type="file"
                :label="`${labelFile}`"
                help="Select one or more PDFs to upload"
                validation="mime:application/pdf"
                multiple
              />
            </div>
            <div v-if="validationFile == 'file' && !multipleFile">
              <FormulateInput
                type="file"
                :label="`${labelFile}`"
                help="Select one PDF to upload"
                validation="mime:application/pdf"
              />
            </div>
            <div v-if="validationFile == 'image' && multipleFile">
              <FormulateInput
                type="image"
                :label="`${labelFile}`"
                help="Select one or more png, jpg or gif to upload."
                validation="mime:image/jpeg,image/png,image/gif"
                multiple
              />
            </div>
            <div v-if="validationFile == 'image' && !multipleFile">
              <FormulateInput
                type="image"
                :label="`${labelFile}`"
                help="Select a png, jpg or gif to upload."
                validation="mime:image/jpeg,image/png,image/gif"
              />
            </div>
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
      items: ["Input Field", "Paragraph", "Select", "Combobox", "File"],
      questionSelected: null,
      // fields required for "Input Field"
      labelInput: null,
      validationInput: false,
      tempInput: null,
      // fields required for "Paragraph"
      labelParagraph: null,
      validationParagraph: false,
      tempParagraph: null,
      // fields required for "Select"
      labelDropdown: null,
      multipleDropdown: false,
      validationDropdown: false,
      addOptionDropdown: null,
      optionsDropdown: [],
      tempDropdown: null,
      // fields required for "Combobox"
      labelCombobox: null,
      placeholderCombobox: null,
      validationCombobox: false,
      addItemCombobox: null,
      itemsCombobox: [],
      tempCombobox: null,
      itemSchema: null,
      // fields required for "File"
      labelFile: null,
      validationFile: null,
      multipleFile: false
    };
  },
  computed: {},
  methods: {
    addItem() {
      if (
        ((this.questionSelected == "Input Field" &&
          (!this.labelInput || !this.itemSelected)) ||
          (this.questionSelected == "Paragraph" &&
            (!this.labelParagraph || !this.itemSelected)) ||
          (this.questionSelected == "Select" &&
            (!this.labelDropdown || !this.itemSelected)) ||
          (this.questionSelected == "Combobox" &&
            (!this.labelCombobox || !this.itemSelected))) &&
        !this.itemSelected &&
        this.schemaArray.length > 0
      ) {
        alert(
          'Please fill in "Label" or select "Choose where to add the question"'
        );
      } else if (
        this.questionSelected == "File" &&
        (!this.labelFile || !this.validationFile || !this.itemSelected) &&
        !this.itemSelected &&
        this.schemaArray.length > 0
      ) {
        alert(
          'Please fill in "Label", choose a file type, or select "Choose where to add the question"'
        );
      } else {
        if (this.questionSelected == this.items[0]) {
          this.itemSchema = {
            label: this.labelInput,
            type: "text",
            validation: this.validationInput ? "required" : null
          };
        } else if (this.questionSelected == this.items[1]) {
          this.itemSchema = {
            label: this.labelParagraph,
            type: "textarea",
            validation: this.validationParagraph ? "required" : null
          };
        } else if (this.questionSelected == this.items[2]) {
          this.itemSchema = {
            label: this.labelDropdown,
            type: "select",
            options: this.optionsDropdown,
            validation: this.validationDropdown ? "required" : null,
            multiple: this.multipleDropdown ? "multiple" : null
          };
        } else if (this.questionSelected == this.items[3]) {
          this.itemSchema = {
            label: this.labelCombobox,
            type: "combobox",
            items: this.itemsCombobox,
            validation: this.validationCombobox ? "required" : null,
            placeholder: this.placeholderCombobox
          };
        } else if (this.questionSelected == this.items[4]) {
          this.itemSchema = {
            label: this.labelFile,
            type: this.validationFile,
            validation:
              this.validationFile == "file"
                ? "mime:application/pdf"
                : "mime:image/jpeg,image/png,image/gif",
            multiple: this.multipleFile ? "multiple" : null,
            help:
              this.validationFile == "file" && this.multipleFile
                ? "Select one or more PDFs to upload"
                : this.validationFile == "file" && !this.multipleFile
                ? "Select one PDF to upload"
                : this.validationFile == "image" && this.multipleFile
                ? "Select one or more png, jpg or gif to upload."
                : this.validationFile == "image" && !this.multipleFile
                ? "Select a png, jpg or gif to upload."
                : "",
            rules: null
          };
        }
        var index = 0;
        if (this.schemaArray.length > 0) {
          index = this.schemaArray.findIndex(
            x => x.label === this.itemSelected
          );
        }
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
      this.validationInput = false;
      this.tempInput = null;
      this.labelParagraph = null;
      this.validationParagraph = false;
      this.tempParagraph = null;
      this.labelDropdown = null;
      this.multipleDropdown = false;
      this.validationDropdown = false;
      this.addOptionDropdown = null;
      this.optionsDropdown = [];
      this.tempDropdown = [];
      this.labelCombobox = null;
      this.placeholderCombobox = null;
      this.validationCombobox = false;
      this.addItemCombobox = null;
      this.itemsCombobox = [];
      this.tempCombobox = [];
      this.itemSelected = null;
      this.labelFile = null;
      this.validationFile = null;
      this.multipleFile = false;
    },
    // functions for fields required for "Select"
    addOptionDropdownFunc() {
      if (this.addOptionDropdown != null && this.addOptionDropdown != "") {
        this.optionsDropdown.push(this.addOptionDropdown);
        this.addOptionDropdown = null;
      }
    },
    removeOptionDropdownFunc: function(option) {
      this.optionsDropdown.splice(this.optionsDropdown.indexOf(option), 1);
    },
    // functions for fields required for "Combobox"
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
