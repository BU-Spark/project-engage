<template>
  <v-combobox
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-model="context.model"
    :items="context.items"
    label="label"
    placeholder="placeholder"
  ></v-combobox>
</template>

<script>
export default {
  components: {},
  props: {
    context: {
      type: Object,
      required: true
    }
  }
};
</script>
