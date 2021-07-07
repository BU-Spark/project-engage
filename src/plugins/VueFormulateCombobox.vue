<template>
  <v-combobox
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-model="context.model"
    :items="context.items"
    v-bind="context.attributes"
    label="Select"
    multiple
    chips
  ></v-combobox>
</template>
<!-- :items="context.items" -->
<!-- :items='["Cool Club", "Very Cool Club", "Cool Cool Club"]' -->
<!-- :items="`${context.items}`" -->
<script>
export default {
  components: {},
  props: {
    context: {
      type: Object,
      items: Array,
      required: true
    }
  }
};
</script>
