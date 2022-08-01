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
      console.log(
        `equal count ${this.fromImage.length}:${this.toImage.length} => ${value}`
      );
      return this.fromImage.length === this.toImage.length;
    },
  },
  methods: {
    handleMorph() {
      console.log("Morphing");
    },
    addPad1(e: Point, t: Point) {
      console.log(`add pad 1: ${e.x}: ${e.y}, ${t}`);
      this.currentImage.push(e);
      this.fromImage.push(e);
    },
    replacePad1() {
      console.log("replace pad 1");
    },
    removePad1() {
      console.log("remove pad 1");
    },
    addPad2(e: Point, t: Point) {
      console.log(`add pad 1: ${e.x}: ${e.y}, ${t}`);
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
