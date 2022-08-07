<template>
  <div class="container">
    <div class="draw-container">
      <div class="draw-pad">
        <DrawPad
          :box-size="200"
          @add="addPad1"
          @replace="replacePad1"
          @remove="removePad1"
        ></DrawPad>
      </div>
      <div class="draw-pad">
        <DrawPad
          :box-size="200"
          @add="addPad2"
          @replace="replacePad2"
          @remove="removePad2"
        ></DrawPad>
      </div>
    </div>
    <button :onclick="handleMorph" class="morph-button" :disabled="!equalCount">
      Morph
    </button>
    <div class="presentation-pad">
      <PresentationPad :box-size="200" :lo="currentImage"></PresentationPad>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import DrawPad from "./DrawPad.vue";
import PresentationPad from "./PresentationPad.vue";
import type { Point } from "../utils/types";
import { interpolateObject } from "d3-interpolate";

declare interface PointWorker {
  p: Point;
  skip: boolean;
}
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function simpleDistance(a: Point, b: Point) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
const numberOfIterations = 10;
export default defineComponent({
  data: () => {
    return {
      fromImage: [] as Point[],
      toImage: [] as Point[],
      currentImage: [] as Point[],
    };
  },
  components: { DrawPad, PresentationPad },
  computed: {
    equalCount() {
      if (!this.fromImage || !this.toImage) return false;
      return this.fromImage.length === this.toImage.length;
    },
  },
  methods: {
    async handleMorph() {
      let morphStep = 0;
      this.currentImage.splice(0, this.currentImage.length);

      const targetImage: Array<Point> = this.normalizeImage(
        this.fromImage,
        this.toImage
      );
      console.log("image: ", targetImage);
      for (let i = 0; i <= numberOfIterations; i++) {
        await sleep(200);
        this.currentImage.splice(0, this.currentImage.length);
        this.fromImage.forEach((f, index) => {
          const e = interpolateObject(f, targetImage[index]);
          this.currentImage.push(e(morphStep));
        });
        morphStep += 1 / numberOfIterations;
      }
    },
    normalizeImage(fromImage: Point[], toImage: Point[]): Array<Point> {
      const remaining = toImage.map((p) => {
        return { p, skip: false };
      });
      return fromImage.map<Point>((point: Point): Point => {
        const res = this.findNearestIndex(point, remaining);
        remaining[res].skip = true;
        return toImage[res];
      });
    },
    findNearestIndex(point: Point, to: PointWorker[]) {
      let shortestIndex = this.selectFirstValidIndex(to);
      to.forEach((current, index) => {
        if (to[index].skip) return shortestIndex;
        const previousDistance = simpleDistance(point, to[shortestIndex].p);
        const currentDistance = simpleDistance(point, current.p);
        if (previousDistance > currentDistance) shortestIndex = index;
      });
      return shortestIndex;
    },
    selectFirstValidIndex(to: PointWorker[]) {
      return to.findIndex((p: PointWorker) => p.skip === false);
    },
    addPad1(e: Point, t: Point) {
      this.fromImage.push(e);
    },
    replacePad1() {
      console.log("replace pad 1");
    },
    removePad1() {
      console.log("remove pad 1");
    },
    addPad2(e: Point, t: Point) {
      this.toImage.push(e);
    },
    replacePad2() {
      console.log("replace pad 1");
    },
    removePad2() {
      console.log("remove pad 1");
    },
  },
});
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.morph-button {
  width: 60px;
  height: 30px;
}
.draw-container {
  display: flex;
  flex-direction: row;
  flex: 1 0 auto;
}
.draw-pad {
  flex: 1 0 auto;
}
.presentation-pad {
  flex: 1 0 auto;
}
</style>
