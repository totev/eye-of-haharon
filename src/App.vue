<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>The 👁</span>
        <span class="font-weight-light"> of HaHaron</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container grid-list-xl>
        <v-layout>
          <provider @providerChanged="selectedProvider=$event" />
        </v-layout>
      </v-container>
      <dropzone :provider="selectedProvider" />
    </v-content>
  </v-app>
</template>

<script>
import Dropzone from "./components/Dropzone.vue";
import Provider from "./components/provider/Provider.vue";
export default {
  name: "App",
  components: {
    Dropzone,
    Provider
  },
  data() {
    return {
      selectedProvider: null
    };
  }
};
</script>
