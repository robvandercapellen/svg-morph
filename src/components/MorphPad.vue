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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
      const value = this.fromImage.length === this.toImage.length;
      return this.fromImage.length === this.toImage.length;
    },
  },
  methods: {
    async handleMorph() {
      let morphStep = 0;
      this.currentImage.splice(0, this.currentImage.length);
      for (let i = 10; i > 0; i--) {
        await sleep(200);
        this.currentImage.splice(0, this.currentImage.length);
        this.fromImage.forEach((f, index) => {
          const e = interpolateObject(f, this.toImage[index]);

          console.log("point", e(morphStep), morphStep);
          this.currentImage.push(e(morphStep));
        });
        morphStep += 1 / 10;
      }
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
