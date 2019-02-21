<template>
  <v-flex>
    <v-select
      :items="providers"
      label="Provider"
      item-text="name"
      solo
      @change="triggerProviderChange"
    ></v-select>
  </v-flex>
</template>

<script>
export default {
  data() {
    return {
      selectedProvider: undefined,
      providers: [{ id: 0, name: "azure" }, { id: 1, name: "aws" }]
    };
  },
  methods: {
    triggerProviderChange(provider) {
      this.$emit("providerChanged", provider);
    }
  }
};
</script>

<style scoped>
</style>