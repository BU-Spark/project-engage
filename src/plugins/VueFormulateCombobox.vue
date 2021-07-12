<template>
  <v-combobox
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-model="context.model"
    :items="items"
    validation="requiredOrNot"
    v-bind="context.attributes"
    label="Select"
    multiple
    chips
  ></v-combobox>
</template>
<script>
export default {
  components: {},
  props: {
    context: {
      type: Object,
      required: true
    },
    items: {
      type: String
    },
    requiredOrNot: {
      type: String
    }
  }
};
</script>
