<template>
  <v-container grid-list-xl>
    <v-layout
      row
      wrap
    >
      <v-flex
        xs4
        v-for="provider in providers"
        :key="provider.name"
      >
        <provider-details :provider="provider" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProviderDetails from "./ProviderDetails.vue";
import { allProviders } from "@/services/provider.service.js";
export default {
  data() {
    return {
      providers: []
    };
  },
  components: {
    ProviderDetails
  },
  mounted() {
    this.providers = allProviders();
  }
};
</script>

<style scoped>
</style>