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

      <provider @providerChanged="onProviderChanged" />
      <dropzone @imageAdded="onImageAdded" />
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

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";
import Dropzone from "./components/Dropzone.vue";
import Provider from "./components/provider/Provider.vue";
import ProviderList from "./components/provider/ProviderList.vue";
import ImagePreview from "./components/ImagePreview.vue";

@Component({
  components: {
    Dropzone,
    Provider,
    ProviderList,
    ImagePreview
  }
})
export default class App extends Vue {
  selectedProvider: string | null;
  addedImage: ImageData | null;

  constructor() {
    super();
    this.selectedProvider=null;
    this.addedImage = null;
  }

  onProviderChanged(provider: string) {
    this.selectedProvider = provider;
  }

  onImageAdded(newImage: ImageData) {
    this.addedImage = newImage;
  }
}
</script>
