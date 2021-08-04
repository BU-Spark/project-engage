<template>
  <v-combobox
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-bind="context.attributes"
    ref="numberComboBox"
    v-model="comboBoxDummyModel"
    @change="onAutoCompleteSelection"
    @keyup="customOnChangeHandler"
    @paste="customOnChangeHandler"
    :items="items"
    persistent-hint
    :hint="
      'Levels: Beginner, Intermediate, Expert (Format: Beginner Python, Intermediate UX Design, Expert Frontend)'
    "
    label="Select"
    :validation="validation"
    multiple
    chips
  ></v-combobox>
</template>
<!-- :rules="[() => !!context.model || 'This field is required']" -->
<script>
export default {
  components: {},
  props: {
    context: {
      type: Object
    },
    items: {
      type: String
    },
    validation: {
      type: String
    }
  },
  data() {
    return {
      comboBoxDummyModel: null,
      comboBoxModel: null
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
    }
  },
  methods: {
    onAutoCompleteSelection() {
      var item = this.comboBoxDummyModel[this.comboBoxDummyModel.length - 1];
      if (
        item.split(" ")[0] != "Beginner" &&
        item.split(" ")[0] != "beginner" &&
        item.split(" ")[0] != "Intermediate" &&
        item.split(" ")[0] != "intermediate" &&
        item.split(" ")[0] != "Expert" &&
        item.split(" ")[0] != "expert"
      ) {
        this.comboBoxDummyModel.splice(this.comboBoxDummyModel.length - 1, 1);
      }
      this.comboBoxModel = this.comboBoxDummyModel;
    },
    customOnChangeHandler() {
      let vm = this;
      setTimeout(function() {
        if (vm.$refs.numberComboBox) {
          vm.comboBoxModel = vm.$refs.numberComboBox.internalSearch;
        }
      });
    }
  }
};
</script>
