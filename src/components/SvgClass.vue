<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div>
    <svg
      style="width: 600px; height: 600px"
      viewBox="0 0 600 600"
      :onmousedown="handleMouseDown"
      :onmousemove="handleMouseMove"
      :onmouseup="handleMouseUp"
      :onmouseout="handleMouseOut"
    >
      <line x1="0" y1="600" x2="600" y2="600" stroke="black" stroke-width="3" />
      <line x1="0" y1="0" x2="0" y2="600" stroke="black" stroke-width="3" />
      <circle
        v-for="p in lo"
        :cx="p.x"
        :cy="p.y"
        r="1"
        stroke="red"
        stroke-width="3"
        fill="red"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { findDir } from "@vue/compiler-core";
import { defineComponent } from "vue";
import { check_a_point } from "../utils/graphical.ts";

declare interface Point {
  x: string;
  y: string;
}
export default defineComponent({
  data: () => {
    return {
      lo: [{ x: "50", y: "50" }] as Point[],
      mouseDown: false,
      selectedPoint: undefined as Point | undefined,
    };
  },

  methods: {
    handleMouseOut(e: MouseEvent) {
      console.log("Mouse out");
      //this.mouseDown = false;
    },
    handleMouseUp(e: MouseEvent) {
      console.log("Mouse Up");
      const currentPoint = { x: e.layerX, y: e.layerY };

      if (this.selectedPoint) {
        const i = this.lo.indexOf(this.selectedPoint);
        console.log("Index:", i);
        this.lo.splice(i, 1);
        const found = this.lo.find((l) => {
          return check_a_point(l.x, l.y, currentPoint.x, currentPoint.y, 3);
        });
        if (!found) this.lo.splice(i, 0, currentPoint);
      } else this.lo.push(currentPoint);

      this.mouseDown = false;
    },
    handleMouseMove(e: MouseEvent) {
      if (this.mouseDown) console.log("Mouse Move");
    },
    handleMouseDown(e: MouseEvent) {
      this.mouseDown = true;
      console.log("testing: ", e.layerX, e.layerY);
      const found = this.lo.find((l) => {
        return check_a_point(l.x, l.y, e.layerX, e.layerY, 3);
      });
      if (found) this.selectedPoint = found;
      console.log("testing: ", this.lo);
    },
  },
});
</script>
