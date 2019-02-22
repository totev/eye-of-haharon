<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>The 👁</span>
        <span class="font-weight-light"> of HaHaron</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>

      <provider-list />

      <provider @providerChanged="selectedProvider=$event" />
      <dropzone @imageAdded="addedImage = $event" />
      <v-container grid-list-xl>
        <image-preview
          :image="addedImage"
          :provider="selectedProvider"
          v-if="addedImage"
        />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Dropzone from "./components/Dropzone.vue";
import Provider from "./components/provider/Provider.vue";
import ProviderList from "./components/provider/ProviderList.vue";
import ImagePreview from "./components/ImagePreview.vue";

export default {
  name: "App",
  components: {
    Dropzone,
    Provider,
    ProviderList,
    ImagePreview
  },
  data() {
    return {
      selectedProvider: null,
      addedImage: null
    };
  }
};
</script>
