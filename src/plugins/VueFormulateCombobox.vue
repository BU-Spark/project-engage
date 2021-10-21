<template>
  <div>
    <div v-if="this.rules != 'required'">
      <v-combobox
        :class="
          `formulate-input-element formulate-input-element--${context.type}`
        "
        :data-type="context.type"
        v-model="context.model"
        :items="items"
        v-bind="context.attributes"
        label="Select"
        multiple
        chips
      ></v-combobox>
    </div>
    <div v-if="this.rules == 'required'">
      <v-combobox
        :class="
          `formulate-input-element formulate-input-element--${context.type}`
        "
        :data-type="context.type"
        v-model="context.model"
        :items="items"
        v-bind="context.attributes"
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
      type: Object
    },
    items: {
      type: Array
    },
    rules: {
      type: String
    }
  }
};
</script>
