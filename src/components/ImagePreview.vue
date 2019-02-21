<template>
  <v-card>
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

    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Image preview {{provider}}</h3>
        <div> Image details </div>
      </div>
    </v-card-title>

    <v-card-text>
      <div>
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

      <div class="source-service">Results from Azure Computer Vision API - v2.0</div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        flat
        color="orange"
      >Share</v-btn>
      <v-btn
        flat
        color="orange"
      >Explore</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  getMatchFromClickOnBoundingBox,
  calculateScaleDimensions
} from "@/services/math.service.js";
import { transformMatchesToRectangles } from "@/services/provider.service.js";

export default {
  props: {
    image: {
      type: Image,
      default: null
    },
    provider: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      matchesCanvas: undefined,
      backgroundImageCanvas: undefined,
      hoveredMatch: {},
      showMatchesOverlay: false
    };
  },
  watch: {
    image: {
      handler() {}
    },
    provider: {
      immediate: true,
      handler() {
        //this.highlightFoundArtefacts(this.image);
      }
    }
  },
  mounted() {
    this.backgroundImageCanvas = this.$refs["processed-canvas"];
    this.matchesCanvas = this.$refs["matches-canvas-layer"];
  },
  beforeUpdate() {
    console.log("before update");
    this.initBackgroundImageCanvas(this.image);
    this.highlightFoundArtefacts(this.image);
  },
  methods: {
    onMetaClick: function({ layerX, layerY }) {
      console.debug(`Clicked on: X:${layerX} Y:${layerY}`);
      this.hoveredMatch = getMatchFromClickOnBoundingBox(layerX, layerY, match);
    },
    initBackgroundImageCanvas: function(image) {
      const backgroundImageCanvasContext = this.backgroundImageCanvas.getContext(
        "2d"
      );
      const matchesCanvasContext = this.matchesCanvas.getContext("2d");
      const scaled = calculateScaleDimensions(
        image,
        backgroundImageCanvasContext.canvas.dataMaxWidth,
        backgroundImageCanvasContext.canvas.dataMaxHeight
      );
      // scale canvases to image size
      backgroundImageCanvasContext.canvas.width = scaled.width;
      backgroundImageCanvasContext.canvas.height = scaled.height;
      matchesCanvasContext.canvas.width = scaled.width;
      matchesCanvasContext.canvas.height = scaled.height;
      // draw scaled image
      backgroundImageCanvasContext.drawImage(
        image,
        0,
        0,
        backgroundImageCanvasContext.canvas.width,
        backgroundImageCanvasContext.canvas.height
      );
    },
    highlightFoundArtefacts: function(image) {
      const rectangles = transformMatchesToRectangles(this.provider, image);
      const matchesCanvasContext = this.matchesCanvas.getContext("2d");
      const matchesCanvasContextCanvase = matchesCanvasContext.canvas;

      // clear canvas prior to drawing
      matchesCanvasContext.clearRect(
        0,
        0,
        matchesCanvasContextCanvase.width,
        matchesCanvasContextCanvase.height
      );

      matchesCanvasContext.strokeStyle = "#3ac7b9";
      rectangles.forEach(rect =>
        matchesCanvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h)
      );
    }
  }
};
</script>

<style lang="css" scoped>
.processed-image {
  position: relative;
}

canvas {
  position: absolute;
  left: 0;
  top: 0;
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