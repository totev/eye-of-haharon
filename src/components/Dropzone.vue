<template>
  <div>
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
    <p> &nbsp;</p>
    <div v-if="imageData">
      <input
        type="checkbox"
        id="checkbox"
        v-model="showMatchesOverlay"
      >
      <label for="checkbox">Show matches: {{showMatchesOverlay}}</label>
      <br />
      <span>Match description: {{hoveredMatch}}</span>
    </div>
    <div class="processed-image">
      <canvas
        id="background-layer"
        ref="processed-canvas"
      ></canvas>
      <canvas
        id="matches-layer"
        ref="matches-canvas-layer"
        :class="{hidden: !showMatchesOverlay}"
      ></canvas>
    </div>
    <div class="source-service">Results from Azure Computer Vision API - v2.0</div>
  </div>
</template>


<script>
import azureResult from "./Azure.js";

const readFile = function(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = ({ ev }) => {
      reject(ev);
    };
    reader.readAsDataURL(file);
  });
};

const loadImage = function(imageData) {
  return new Promise(resolve => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img), false);
    img.src = imageData;
  });
};

const calculateScaleDimensions = function(img, maxWidth, maxHeight) {
  const scaled = {
    ratio: img.width / img.height,
    width: img.width,
    height: img.height
  };
  if (scaled.width > maxWidth) {
    scaled.width = maxWidth;
    scaled.height = scaled.width / scaled.ratio;
  }
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }
  return scaled;
};

export default {
  data() {
    return {
      imageData: undefined,
      isInitial: true,
      isUploading: undefined,
      canvasContext: undefined,
      matchesCanvasContext: undefined,
      showMatchesOverlay: true,
      hoveredMatch:{}
    };
  },
  mounted() {
    this.canvasContext = this.$refs["processed-canvas"].getContext("2d");
    this.matchesCanvasContext = this.$refs["matches-canvas-layer"].getContext(
      "2d"
    );
  },
  methods: {
    uploadImage: () => {
      return undefined;
    },
    loadFile: async function(file) {
      this.imageData = await readFile(file);
    },
    initCanvas: async function() {
      const image = await loadImage(this.imageData);
      const canvas = this.canvasContext.canvas;
      const scaled = calculateScaleDimensions(
        image,
        canvas.dataMaxWidth,
        canvas.dataMaxHeight
      );
      console.debug("Scaling canvas to: ", scaled);
      // scale canvases to image size
      canvas.width = scaled.width;
      canvas.height = scaled.height;
      this.matchesCanvasContext.canvas.width = scaled.width;
      this.matchesCanvasContext.canvas.height = scaled.height;
      // draw scaled image
      this.canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);
    },

    async filesChange(fieldName, fileList) {
      // handle file changes
      if (!fileList.length) return;

      const file = fileList[0];
      await this.loadFile(file);
      await this.initCanvas();
      this.highlightFoundArtefacts();
    },

    highlightFoundArtefacts: function() {
      const rectangles = azureResult.objects.map(it => it.rectangle);
      this.matchesCanvasContext.strokeStyle = "#3ac7b9";
      rectangles.forEach(rect =>
        this.matchesCanvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h)
      );
    }
  }
};
</script>

<style lang="css" scoped>
.local-image img {
  width: 80%;
  height: 60%;
}

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

.processed-image {
  position: fixed;
}

canvas {
  position: absolute;
}
#matches-layer {
  z-index: 2;
}
#background-layer {
  z-index: 1;
}
.hidden {
  display: none;
}
</style>
