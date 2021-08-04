<template>
  <div>
    <div v-if="this.rules != 'required'">
      <v-textarea
        :class="
          `formulate-input-element formulate-input-element--${context.type}`
        "
        :data-type="context.type"
        v-bind="context.attributes"
        v-model="context.model"
      ></v-textarea>
    </div>
    <div v-if="this.rules == 'required'">
      <v-textarea
        :class="
          `formulate-input-element formulate-input-element--${context.type}`
        "
        :data-type="context.type"
        v-bind="context.attributes"
        v-model="context.model"
        :rules="[() => !!context.model || 'This field is required']"
      ></v-textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object
    },
    rules: {
      type: String
    }
  }
};
</script>
