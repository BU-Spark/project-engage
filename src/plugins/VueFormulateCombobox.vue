<template>
  <v-combobox
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-model="context.model"
    :items="items"
    v-bind="context.attributes"
    :validation="validation"
    label="Select"
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
  }
};
</script>
