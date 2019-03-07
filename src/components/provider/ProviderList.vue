<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs4 v-for="provider in providers" :key="provider.name">
        <provider-details :provider="provider" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

import ProviderDetails from "./ProviderDetails.vue";
import { allProviders } from "@/services/provider.service.ts";
import { GenericProvider } from "@/components/provider/generic-provider.ts";

@Component({
  components: { ProviderDetails }
})
export default class ProviderList extends Vue {
  providers: GenericProvider[];
  constructor() {
    super();
    this.providers = [];
  }

  mounted() {
    this.providers = allProviders();
  }
}
</script>

<style scoped>
</style>