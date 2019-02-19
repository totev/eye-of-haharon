<template>
  <div>
    Provider
    <select @change="triggerProviderChange">
      <option value="">Please select a provider</option>
      <option
        v-for="provider in providers"
        :key="provider.id"
        v-bind:value="provider.name"
      >
        {{provider.name}}
      </option>
    </select>
  </div>
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
    triggerProviderChange($event) {
      this.$emit("providerChanged", $event.target.value);
    }
  }
};
</script>

<style scoped>
</style>