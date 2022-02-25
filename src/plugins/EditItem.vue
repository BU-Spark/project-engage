<template>
  <div>
    <!-- admin chooses a question to edit -->
    <v-select
      :items="schemaArray"
      item-text="label"
      v-model="itemSelected"
      v-validate="required"
      label="Choose an item to edit"
      v-on:change="getQuestionType(itemSelected)"
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
            label="id"
            v-model="nameInput"
            :rules="[checkid, rules.required]"
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
          <v-text-field
            label="id"
            v-model="nameParagraph"
            :rules="[checkid, rules.required]"
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
          <v-text-field
            label="id"
            v-model="nameDropdown"
            :rules="[checkid, rules.required]"
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
            label="id"
            v-model="nameCombobox"
            :rules="[checkid, rules.required]"
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
          <v-text-field
            label="id"
            v-model="nameFile"
            :rules="[checkid, rules.required]"
            outlined
          ></v-text-field>
          <v-checkbox
            v-model="multipleFile"
            :label="`Allow multiple files? ${multipleFile.toString()}`"
          ></v-checkbox>
        </v-col>
        <!-- View FormulateInput "File" UI -->
        <v-col cols="12" sm="6" class="pa-5">
          <v-card class="pa-10 mb-4" outlined tile>
            <h4>Preview</h4>
            <div v-if="multipleFile">
              <FormulateInput
                type="file"
                :label="`${labelFile}`"
                help="Select one or more PDFs to upload"
                multiple
              />
            </div>
            <div v-if="!multipleFile">
              <FormulateInput
                type="file"
                :label="`${labelFile}`"
                help="Select one file to upload"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- fields required for "New Section" -->
    <v-container
      class="grey lighten-5"
      v-if="this.questionSelected == 'New Section'"
    >
      <v-row no-gutters>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Section Name"
            v-model="labelSection"
            hint="Experiences, Section 1, etc."
            :rules="[() => !!labelSection || 'This field is required']"
            outlined
          ></v-text-field>
          <v-text-field
            label="id"
            v-model="nameSection"
            :rules="[checkid, rules.required]"
            outlined
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>

    <v-btn @click="cancelItem()">Cancel</v-btn>
    <v-btn @click="editItem()">Confirm Edit</v-btn>
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
      // types of questions, pair the current selected item to the type of question
      schemaArray: this.schema,
      itemSelected: null,
      currElementIndex: null,
      items: [
        "Input Field",
        "Paragraph",
        "Select",
        "Combobox",
        "File",
        "New Section"
      ],
      questionSelected: null,
      rules: {
        required: v => !!v || "this field is required"
      },
      // fields required for "Input Field"
      labelInput: null,
      nameInput: null,
      validationInput: false,
      tempInput: null,
      // fields required for "Paragraph"
      labelParagraph: null,
      nameParagraph: null,
      validationParagraph: false,
      tempParagraph: null,
      // fields required for "Select"
      labelDropdown: null,
      nameDropdown: null,
      multipleDropdown: false,
      validationDropdown: false,
      addOptionDropdown: null,
      optionsDropdown: [],
      tempDropdown: null,
      // fields required for "Combobox"
      labelCombobox: null,
      nameCombobox: null,
      placeholderCombobox: null,
      validationCombobox: false,
      addItemCombobox: null,
      itemsCombobox: [],
      tempCombobox: null,
      itemSchema: null,
      // fields required for "File"
      labelFile: null,
      nameFile: null,
      validationFile: false,
      multipleFile: false,
      // fields required for "New Section"
      labelSection: null,
      nameSection: null
    };
  },
  computed: {},
  methods: {
    getQuestionType(itemSelected) {
      this.eraseFields();
      this.currElementIndex = this.schemaArray.findIndex(
        data => data.label === itemSelected
      );
      let elementInfo = this.schemaArray[this.currElementIndex];
      console.log(elementInfo.type);
      if (elementInfo.type == "text" || elementInfo.type == undefined) {
        this.questionSelected = this.items[0];
        this.labelInput = elementInfo.label;
        this.nameInput = elementInfo.name;
        this.validationInput =
          elementInfo.validation != undefined &&
          elementInfo.validation != "" &&
          elementInfo.validation != false
            ? true
            : false;
      } else if (elementInfo.type == "textarea") {
        this.questionSelected = this.items[1];
        this.labelParagraph = elementInfo.label;
        this.nameParagraph = elementInfo.name;
        this.validationParagraph =
          elementInfo.validation != undefined &&
          elementInfo.validation != "" &&
          elementInfo.validation != false
            ? true
            : false;
      } else if (elementInfo.type == "select") {
        this.questionSelected = this.items[2];
        this.labelDropdown = elementInfo.label;
        this.nameDropdown = elementInfo.name;
        this.optionsDropdown = elementInfo.options;
        this.validationDropdown =
          elementInfo.validation != undefined &&
          elementInfo.validation != "" &&
          elementInfo.validation != false
            ? true
            : false;
        this.multipleDropdown =
          elementInfo.multiple == "multiple" ? true : false;
      } else if (
        elementInfo.type == "combobox" ||
        elementInfo.type == "comboboxSpecial"
      ) {
        this.questionSelected = this.items[3];
        this.labelCombobox = elementInfo.label;
        this.nameCombobox = elementInfo.name;
        this.itemsCombobox = elementInfo.items;
        this.validationCombobox =
          elementInfo.validation != undefined &&
          elementInfo.validation != "" &&
          elementInfo.validation != false
            ? true
            : false;
        this.placeholderCombobox = elementInfo.placeholder;
      } else if (elementInfo.type == "file") {
        this.questionSelected = this.items[4];
        this.labelFile = elementInfo.label;
        this.nameFile = elementInfo.name;
        this.validationFile =
          elementInfo.validation == undefined &&
          elementInfo.validation != "" &&
          elementInfo.validation != false
            ? true
            : false;
        this.multipleFile =
          elementInfo.multiple != undefined &&
          elementInfo.multiple != "" &&
          elementInfo.multiple != false
            ? true
            : false;
      } else {
        this.questionSelected = null;
      }
    },
    checkid(val) {
      if (
        this.schema.some(el => el.name === val) == true &&
        this.schema[this.currElementIndex].name != val
      ) {
        return `Name "${val}" already exist`;
      } else {
        return true;
      }
    },
    editItem() {
      if (
        this.nameInput == "firstname" ||
        this.nameParagraph == "firstname" ||
        this.nameDropdown == "firstname" ||
        this.nameCombobox == "firstname" ||
        this.nameFile == "firstname" ||
        this.nameSection == "firstname" ||
        this.nameInput == "lastname" ||
        this.nameParagraph == "lastname" ||
        this.nameDropdown == "lastname" ||
        this.nameCombobox == "lastname" ||
        this.nameFile == "lastname" ||
        this.nameSection == "lastname" ||
        this.nameInput == "semester" ||
        this.nameParagraph == "semester" ||
        this.nameDropdown == "semester" ||
        this.nameCombobox == "semester" ||
        this.nameFile == "semester" ||
        this.nameSection == "semester" ||
        this.nameInput == "program" ||
        this.nameParagraph == "program" ||
        this.nameDropdown == "program" ||
        this.nameCombobox == "program" ||
        this.nameFile == "program" ||
        this.nameSection == "program" ||
        this.nameInput == "schoolYear" ||
        this.nameParagraph == "schoolYear" ||
        this.nameDropdown == "schoolYear" ||
        this.nameCombobox == "schoolYear" ||
        this.nameFile == "schoolYear" ||
        this.nameSection == "schoolYear" ||
        this.nameInput == "gender" ||
        this.nameParagraph == "gender" ||
        this.nameDropdown == "gender" ||
        this.nameCombobox == "gender" ||
        this.nameFile == "gender" ||
        this.nameSection == "gender" ||
        this.nameInput == "email" ||
        this.nameParagraph == "email" ||
        this.nameDropdown == "email" ||
        this.nameCombobox == "email" ||
        this.nameFile == "email" ||
        this.nameSection == "email" ||
        this.nameInput == "status" ||
        this.nameParagraph == "status" ||
        this.nameDropdown == "status" ||
        this.nameCombobox == "status" ||
        this.nameFile == "status" ||
        this.nameSection == "status" ||
        this.nameInput == "note" ||
        this.nameParagraph == "note" ||
        this.nameDropdown == "note" ||
        this.nameCombobox == "note" ||
        this.nameFile == "note" ||
        this.nameSection == "note"
      ) {
        alert(
          'id "firstname", "lastname", "semester", "program", "schoolYear", "gender", "email", "status", or "note" cannot be used'
        );
      } else if (
        this.questionSelected == "File" &&
        (!this.labelFile ||
          !this.nameFile ||
          this.schema.some(el => el.name === this.nameFile) ||
          !this.validationFile ||
          (!this.itemSelected && this.schemaArray.length > 0))
      ) {
        alert(
          'Please fill in "Label", fill out "id" and check for duplication, choose a file type, or select "Choose where to add the question"'
        );
      } else {
        if (this.questionSelected == this.items[0]) {
          this.itemSchema = {
            label: this.labelInput,
            name: this.nameInput,
            type: "text",
            validation: this.validationInput ? "required" : null
          };
        } else if (this.questionSelected == this.items[1]) {
          this.itemSchema = {
            label: this.labelParagraph,
            name: this.nameParagraph,
            type: "textarea",
            validation: this.validationParagraph ? "required" : null
          };
        } else if (this.questionSelected == this.items[2]) {
          this.itemSchema = {
            label: this.multipleDropdown
              ? this.labelDropdown +
                " (hold the command key (mac) or option key (windows))"
              : this.labelDropdown,
            name: this.nameDropdown,
            type: "select",
            options: this.optionsDropdown,
            validation: this.validationDropdown ? "required" : null,
            multiple: this.multipleDropdown ? "multiple" : null
          };
        } else if (this.questionSelected == this.items[3]) {
          this.itemSchema = {
            label: this.labelCombobox,
            name: this.nameCombobox,
            type: this.schemaArray[this.currElementIndex].type,
            items: this.itemsCombobox,
            validation: this.validationCombobox ? "required" : null,
            placeholder: this.placeholderCombobox
          };
        } else if (this.questionSelected == this.items[4]) {
          this.multipleFile
            ? (this.itemSchema = {
                label: this.labelFile,
                name: this.nameFile,
                type: "file",
                validation: "checkFileType",
                multiple: "multiple",
                help:
                  this.validationFile && this.multipleFile
                    ? "Select one or more files (pdf, doc, docx, jpeg, jpg, png) to upload"
                    : this.validationFile && !this.multipleFile
                    ? "Select one file (pdf, doc, docx, jpeg, jpg, png) to upload"
                    : "",
                rules: null
              })
            : (this.itemSchema = {
                label: this.labelFile,
                name: this.nameFile,
                type: "file",
                validation: "checkFileType",
                help:
                  this.validationFile && this.multipleFile
                    ? "Select one or more files (pdf, doc, docx, jpeg, jpg, png) to upload"
                    : this.validationFile && !this.multipleFile
                    ? "Select one file (pdf, doc, docx, jpeg, jpg, png) to upload"
                    : "",
                rules: null
              });
        } else if (this.questionSelected == this.items[5]) {
          this.itemSchema = {
            label: this.labelSection,
            name: this.nameSection,
            type: "hr"
          };
        }

        this.schemaArray.splice(this.currElementIndex, 0, this.itemSchema);
        this.$emit("editItem", false);
        this.$emit("itemEdited", this.schemaArray);
        alert("You have successfully edited the item!");
      }
    },
    cancelItem() {
      this.$emit("editItem", false);
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
      console.log("here2");
      this.labelInput = null;
      this.nameInput = null;
      this.validationInput = false;
      this.tempInput = null;
      this.labelParagraph = null;
      this.nameParagraph = null;
      this.validationParagraph = false;
      this.tempParagraph = null;
      this.labelDropdown = null;
      this.nameDropdown = null;
      this.multipleDropdown = false;
      this.validationDropdown = false;
      this.addOptionDropdown = null;
      this.optionsDropdown = [];
      this.tempDropdown = [];
      this.labelCombobox = null;
      this.nameCombobox = null;
      this.placeholderCombobox = null;
      this.validationCombobox = false;
      this.addItemCombobox = null;
      this.itemsCombobox = [];
      this.tempCombobox = [];
      this.itemSelected = null;
      this.labelFile = null;
      this.nameFile = null;
      this.validationFile = false;
      this.multipleFile = false;
      this.labelSection = null;
      this.nameSection = null;
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
