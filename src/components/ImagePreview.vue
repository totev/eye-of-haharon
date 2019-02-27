<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Image preview {{ provider }}</h3>
        <div>Image details</div>
      </div>
    </v-card-title>

    <v-card-text class="proccesed-image-card" ref="proccesed-image-card">
      <div class="source-service">
        Results from Azure Computer Vision API - v2.0
      </div>
      <div class="canvas-wrapper" v-resize="debouncedResize()">
        <canvas id="background-layer" ref="processed-canvas"></canvas>
        <canvas
          id="matches-layer"
          ref="matches-canvas-layer"
          @click.left="onMetaClick"
          :class="{ hidden: !showMatchesOverlay }"
        ></canvas>
      </div>

      <div v-if="showMatchesOverlay && hoveredMatch">
        <span>Match description: {{ hoveredMatch.object }}.</span>
        <span>Confidence: {{ hoveredMatch.confidence }}</span>
      </div>
      <div v-if="!hoveredMatch">
        No match clicked. Try clicking on one of those colored recatangles.
      </div>
    </v-card-text>

    <v-card-actions end>
      <v-switch
        v-model="showMatchesOverlay"
        label="Show/hide matches"
      ></v-switch>
    </v-card-actions>
  </v-card>
</template>

<script>
import {
  getMatchFromClickOnBoundingBox,
  calculateScaleDimensions
} from "@/services/math.service.js";
import {
  transformMatchesToRectangles,
  scaleRectangles
} from "@/services/provider.service.js";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";

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
      proccesedImageCard: undefined,
      hoveredMatch: {},
      showMatchesOverlay: false,
      matchedBBoxes: [],
      scale: undefined
    };
  },
  watch: {
    scale: {
      handler() {
        this.initCanvases();
      }
    },
    provider: {
      immediate: true,
      async handler() {
        await this.collectAndRemapMatchesForImageAndProvider();
        this.highlightFoundArtefacts(this.image);
      }
    }
  },
  mounted() {
    this.backgroundImageCanvas = this.$refs["processed-canvas"];
    this.matchesCanvas = this.$refs["matches-canvas-layer"];
    this.proccesedImageCard = this.$refs["proccesed-image-card"];
  },
  beforeUpdate() {
    console.log("before update");
  },
  methods: {
    initCanvases() {
      this.clearCanvas(this.matchesCanvas);
      this.clearCanvas(this.backgroundImageCanvas);
      this.initBackgroundImageCanvas(this.image, this.scale);
      if (isEmpty(this.matchedBBoxes) === false) {
        this.highlightFoundArtefacts(this.image, this.scale);
      }
    },
    resizeCanvases() {
      try {
        // consider vuetify's styling -> currently padding: 16px;
        const stylingOffset = 16;
        const resizedWidth = Math.abs(
          this.proccesedImageCard.clientWidth - stylingOffset * 2
        );
        const resizedHeight = this.proccesedImageCard.clientHeight;

        // ignore if the new size is bigger than the original image's
        if (
          this.image.resizedWidth < resizedWidth ||
          this.image.resizedHeight < resizedHeight
        ) {
          return;
        }

        this.scale = calculateScaleDimensions(
          this.image,
          resizedWidth,
          resizedHeight
        );
      } catch (error) {
        console.error("Something went wrong while resizing image card", error);
      }
    },
    debouncedResize() {
      return debounce(this.resizeCanvases, 500);
    },
    onMetaClick: function({ layerX, layerY }) {
      console.debug(`Clicked on: X:${layerX} Y:${layerY}`);
      this.hoveredMatch = getMatchFromClickOnBoundingBox(layerX, layerY, match);
    },
    initBackgroundImageCanvas: function(image, scaled) {
      const backgroundImageCanvasContext = this.backgroundImageCanvas.getContext(
        "2d"
      );
      const matchesCanvasContext = this.matchesCanvas.getContext("2d");

      scaled = scaled || calculateScaleDimensions(image);
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
    async collectAndRemapMatchesForImageAndProvider() {
      this.matchedBBoxes = await transformMatchesToRectangles(
        this.provider,
        this.image
      );
    },
    async highlightFoundArtefacts(image, scale) {
      scale = scale || this.scale;
      const matchesCanvasContext = this.matchesCanvas.getContext("2d");

      // clear canvas prior to drawing
      this.clearCanvas(this.matchesCanvas);

      const scaledRects = scaleRectangles(this.matchedBBoxes, scale);

      matchesCanvasContext.strokeStyle = "#3ac7b9";
      scaledRects.forEach(rect =>
        matchesCanvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h)
      );
    },
    clearCanvas(canvas) {
      if (!canvas) return;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
  }
};
</script>

<style lang="css" scoped>
.canvas-wrapper {
  display: grid;
}

.canvas-wrapper canvas {
  grid-column: 1;
  grid-row: 1;
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