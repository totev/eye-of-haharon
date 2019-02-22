<template>
  <v-card color="primary">
    <v-card-title>
      {{provider.name}}
    </v-card-title>
    <v-card-text>{{provider.details}}</v-card-text>
  </v-card>
</template>

<script>
import GenericProvider from "./GenericProvider.js";

export default {
  props: {
    provider: {
      type: GenericProvider,
      default: {}
    }
  }
};
</script>

<style scoped>
</style>