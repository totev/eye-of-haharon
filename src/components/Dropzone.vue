<template>
  <div class="container">
    <h1>Upload images</h1>
    <div class="dropbox">
      <input
        type="file"
        name="imageUpload"
        multiple="false"
        :disabled="isUploading"
        v-on:change.prevent="filesChange($event.target.name, $event.target.files);"
        accept="image/*"
        class="input-file"
      >
      <p v-if="isInitial">
        Drag your file here to begin<br> or click to browse
      </p>
      <p v-if="isUploading">
        Uploading your image...
      </p>
    </div>
  </div>
</template>

<script>
import { loadImage, readFile } from "@/services/helper.service.js";

export default {
  data() {
    return {
      isInitial: true,
      isUploading: undefined
    };
  },
  methods: {
    async filesChange(fieldName, fileList) {
      // handle file changes
      if (!fileList.length) return;

      const file = fileList[0];
      const fileData = await readFile(file);
      const image = await loadImage(fileData);
      this.$emit("imageAdded", image);
    }
  }
};
</script>

<style lang="css" scoped>
.dropbox {
  outline: 2px dotted black; /* the dash box */
  outline-offset: -10px;
  background: #80f7c760;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
