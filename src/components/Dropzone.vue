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
    <div v-if="image">
      <input
        type="checkbox"
        id="checkbox"
        v-model="showMatchesOverlay"
      >
      <label for="checkbox">Show/hide matches</label>
      <br />
      <div v-if="showMatchesOverlay && hoveredMatch">
        <span>Match description: {{hoveredMatch.object}}.</span>
        <span>Confidence: {{hoveredMatch.confidence}}</span>
      </div>
      <div v-if="!hoveredMatch">
        No match clicked. Try clicking on one of those colored recatangles.
      </div>
    </div>
    <div class="processed-image">
      <canvas
        id="background-layer"
        ref="processed-canvas"
      ></canvas>
      <canvas
        id="matches-layer"
        ref="matches-canvas-layer"
        @click.left="onMetaClick"
        :class="{hidden: !showMatchesOverlay}"
      ></canvas>
    </div>
    <div class="source-service">Results from Azure Computer Vision API - v2.0</div>
  </div>
</template>

<script>
import {
  loadResultForService,
  transformMatchesToRectangles
} from "@/services/provider.service.js";
import {
  getMatchFromClickOnBoundingBox,
  calculateScaleDimensions
} from "@/services/math.service.js";
import { loadImage, readFile } from "@/services/helper.service.js";

export default {
  props: {
    provider: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      image: undefined,
      isInitial: true,
      isUploading: undefined,
      canvasContext: undefined,
      matchesCanvasContext: undefined,
      matchesCanvas: undefined,
      showMatchesOverlay: true,
      hoveredMatch: {},
      remoteServiceResults: []
    };
  },
  mounted() {
    this.canvasContext = this.$refs["processed-canvas"].getContext("2d");
    this.matchesCanvas = this.$refs["matches-canvas-layer"];
    this.matchesCanvasContext = this.matchesCanvas.getContext("2d");
  },
  watch: {
    provider: {
      immediate: true,
      handler(val) {
        this.highlightFoundArtefacts(this.image);
      }
    }
  },
  methods: {
    uploadImage: () => {
      return undefined;
    },
    onMetaClick: function({ layerX, layerY }) {
      console.debug(`Clicked on: X:${layerX} Y:${layerY}`);
      this.hoveredMatch = getMatchFromClickOnBoundingBox(layerX, layerY, match);
    },
    initCanvas: function(image) {
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
      const fileData = await readFile(file);
      this.image = await loadImage(fileData);

      this.initCanvas(this.image);
      this.highlightFoundArtefacts(this.image);
    },

    highlightFoundArtefacts: function(image) {
      console.debug("highlightFoundArtefacts provider", this.provider);

      const rectangles = transformMatchesToRectangles(this.provider, image);

      // clear canvas prior to drawing
      this.matchesCanvasContext.clearRect(
        0,
        0,
        this.matchesCanvas.width,
        this.matchesCanvas.height
      );

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
