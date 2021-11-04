<template>
  <div>
    <div v-if="this.validation != 'required'">
      <v-combobox
        :class="`formulate-input-element formulate-input-element--${context.type}`"
        :data-type="context.type"
        v-bind="context.attributes"
        ref="numberComboBox"
        v-model="context.model"
        @change="onAutoCompleteSelection(context.model)"
        @keyup="customOnChangeHandler"
        @paste="customOnChangeHandler"
        :items="items"
        persistent-hint
        :hint="'Levels: Beginner, Intermediate, Expert (Format: Beginner Python, Intermediate UX Design, Expert Frontend)'"
        label="Select"
        multiple
        chips
      ></v-combobox>
    </div>
    <div v-if="this.validation == 'required'">
      <v-combobox
        :class="`formulate-input-element formulate-input-element--${context.type}`"
        :data-type="context.type"
        v-bind="context.attributes"
        ref="numberComboBox"
        v-model="context.model"
        @change="onAutoCompleteSelection(context.model)"
        @keyup="customOnChangeHandler"
        @paste="customOnChangeHandler"
        :items="items"
        persistent-hint
        :hint="'Levels: Beginner, Intermediate, Expert (Format: Beginner Python, Intermediate UX Design, Expert Frontend)'"
        label="Select"
        :rules="[() => !!context.model || 'This field is required']"
        multiple
        chips
      ></v-combobox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
    },
    items: {
      type: Array,
    },
    validation: {
      type: String,
    },
  },
  data() {
    return {
      comboBoxDummyModel: [],
      comboBoxModel: [],
    };
  },
  computed: {
    inputErrors() {
      const errors = [];
      if (!this.comboBoxModel) {
        return errors;
      }
      // if (this.comboBoxModel.split(' ')[0] == "Beginner" || this.comboBoxModel.split(' ')[0] == "beginner" ||
      //     this.comboBoxModel.split(' ')[0] == "Intermediate" || this.comboBoxModel.split(' ')[0] == "intermediate" ||
      //     this.comboBoxModel.split(' ')[0] == "Expert" || this.comboBoxModel.split(' ')[0] == "expert") {
      //     return errors;
      // }
      errors.push("Please follow the input format");
      return errors;
    },
  },
  methods: {
    onAutoCompleteSelection(inputs) {
      this.comboBoxDummyModel = inputs;
      console.log(this.comboBoxDummyModel);
      console.log("this.comboBoxDummyModel");
      if (this.comboBoxDummyModel != null) {
        var index = this.comboBoxDummyModel.length - 1;
        var item = this.comboBoxDummyModel[index];
        var firstWord = item.split(" ")[0];
        if (
          firstWord != "Beginner" &&
          firstWord != "beginner" &&
          firstWord != "Intermediate" &&
          firstWord != "intermediate" &&
          firstWord != "Expert" &&
          firstWord != "expert"
        ) {
          this.comboBoxDummyModel.splice(this.comboBoxDummyModel.length - 1, 1);
        }
        if (
          firstWord == "beginner" ||
          firstWord == "intermediate" ||
          firstWord == "expert"
        ) {
          this.comboBoxDummyModel[index] =
            item.charAt(0).toUpperCase() + item.slice(1);
        }
        this.comboBoxModel = this.comboBoxDummyModel;
      }
    },
    customOnChangeHandler() {
      let vm = this;
      setTimeout(function () {
        if (vm.$refs.numberComboBox) {
          vm.comboBoxModel = vm.$refs.numberComboBox.internalSearch;
        }
      });
    },
  },
};
</script>
