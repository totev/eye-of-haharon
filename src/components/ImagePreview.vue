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
      <div class="canvas-wrapper" v-resize="this.debouncedResize()">
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  getMatchFromClickOnBoundingBox,
  calculateScaleDimensions
} from "@/services/math.service.ts";
import {
  transformMatchesToRectangles,
  scaleRectangles,
  collectAndTransformMatchesToRectangles
} from "@/services/provider.service.ts";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { Scale } from "@/components/provider/scale";
import { Rectangle } from "@/components/provider/shapes/rectangle";
import { ImageWrapper } from "@/components/provider/shapes/image-wrapper";
import { CloudProvider } from "@/components/provider/generic-provider";

@Component({})
export default class ImagePreview extends Vue {
  @Prop({ default: null }) image: ImageData;
  @Prop() provider: CloudProvider;

  public matchesCanvas!: HTMLCanvasElement;
  public backgroundImageCanvas!: HTMLCanvasElement;
  public proccesedImageCard!: HTMLCanvasElement;
  public hoveredMatch: Rectangle;
  public showMatchesOverlay = true;
  public matchedBBoxes: Rectangle[] = [];
  public scale: Scale = Scale.buildEmpty();

  @Watch("image") onImageChanged() {
    if (this.image) {
      this.initCanvases();
    }
  }

  @Watch("scale") onScaleChanged() {
    if (this.image) {
      this.initCanvases();
    }
  }

  @Watch("provider") async onProviderChanged() {
    if (this.image) {
      await this.collectAndRemapMatchesForImageAndProvider();
      this.highlightFoundArtefacts(this.image, this.scale);
    }
  }

  constructor() {
    super();
    this.hoveredMatch = new Rectangle();
  }

  mounted() {
    this.backgroundImageCanvas = this.$refs[
      "processed-canvas"
    ] as HTMLCanvasElement;
    this.matchesCanvas = this.$refs[
      "matches-canvas-layer"
    ] as HTMLCanvasElement;
    this.proccesedImageCard = this.$refs[
      "proccesed-image-card"
    ] as HTMLCanvasElement;
  }

  initCanvases() {
    this.clearCanvas(this.matchesCanvas);
    this.clearCanvas(this.backgroundImageCanvas);
    this.initBackgroundImageCanvas(this.image, this.scale);
    if (isEmpty(this.matchedBBoxes) === false) {
      this.highlightFoundArtefacts(this.image, this.scale);
    }
  }

  resizeCanvases() {
    try {
      // consider vuetify's styling -> currently padding: 16px;
      const stylingOffset = 16;
      const resizedWidth = Math.abs(
        this.proccesedImageCard.clientWidth - stylingOffset * 2
      );
      const resizedHeight = this.proccesedImageCard.clientHeight;

      const maybeNewScale = calculateScaleDimensions(this.image, resizedWidth);

      // ignore if the new size is bigger than the original image's
      if (isEqual(maybeNewScale, this.scale) === false) {
        console.debug("Image scale detected. Will scale to: ", maybeNewScale);
        this.scale = maybeNewScale;
      }
    } catch (error) {
      console.error("Something went wrong while resizing image card", error);
    }
  }

  debouncedResize() {
    return debounce(this.resizeCanvases, 240);
  }

  onMetaClick({ layerX, layerY }: { layerX: number; layerY: number }) {
    console.debug(`Clicked on: X:${layerX} Y:${layerY}`);
    this.hoveredMatch = getMatchFromClickOnBoundingBox(
      layerX,
      layerY,
      this.matchedBBoxes
    );
  }

  initBackgroundImageCanvas(image: ImageData, scaled: Scale) {
    scaled = scaled || calculateScaleDimensions(image);
    const backgroundImageCanvasContext = this.backgroundImageCanvas.getContext(
      "2d"
    );

    if (backgroundImageCanvasContext instanceof CanvasRenderingContext2D) {
      // scale canvases to image size
      backgroundImageCanvasContext.canvas.width = scaled.width;
      backgroundImageCanvasContext.canvas.height = scaled.height;

      // draw scaled image
      backgroundImageCanvasContext.drawImage(
        <any>image,
        0,
        0,
        backgroundImageCanvasContext.canvas.width,
        backgroundImageCanvasContext.canvas.height
      );
    }

    const matchesCanvasContext = this.matchesCanvas.getContext("2d");
    if (matchesCanvasContext instanceof CanvasRenderingContext2D) {
      // scale canvases to image size
      matchesCanvasContext.canvas.width = scaled.width;
      matchesCanvasContext.canvas.height = scaled.height;
    }
  }

  async collectAndRemapMatchesForImageAndProvider() {
    this.matchedBBoxes = await collectAndTransformMatchesToRectangles(
      this.provider,
      this.image
    );
  }

  async highlightFoundArtefacts(image: ImageWrapper, scale: Scale) {
    const matchesCanvasContext = this.matchesCanvas.getContext("2d");

    // clear canvas prior to drawing
    this.clearCanvas(this.matchesCanvas);

    const scaledRects = scaleRectangles(this.matchedBBoxes, scale);

    if (matchesCanvasContext) {
      matchesCanvasContext.strokeStyle = "#3ac7b9";
      scaledRects.forEach(rect =>
        matchesCanvasContext.strokeRect(rect.x, rect.y, rect.w, rect.h)
      );
    }
  }

  clearCanvas(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }
}
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