<template>
  <div>
    <!-- admin chooses an item to delete -->
    <v-select
      :items="schemaArray"
      item-text="label"
      v-model="itemSelected"
      v-validate="required"
      label="Choose an item to delete"
      outlined
    ></v-select>

    <v-btn @click="cancel()">Cancel</v-btn>
    <v-btn @click="deleteItem()">Confirm Delete</v-btn>
  </div>
</template>

<script>
export default {
  name: "DeleteItem",
  components: {},
  props: {
    schema: Array
  },
  data() {
    return {
      schemaArray: this.schema,
      itemSelected: null
    };
  },
  computed: {},
  methods: {
    deleteItem() {
      if (!this.itemSelected) {
        alert("Pleaase select an item to delete");
      } else {
        var index = this.schemaArray.findIndex(
          x => x.label === this.itemSelected
        );
        this.schemaArray.splice(index, 1);
        this.$emit("deleteItem", false);
        this.$emit("itemDeleted", this.schemaArray);
        alert("You have successfully deleted an item!");
      }
    },
    cancel() {
      this.itemSelected = null;
      this.$emit("deleteItem", false);
    }
  }
};
</script>
