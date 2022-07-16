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
      <path :d="path" stroke="red" stroke-width="3" fill="red" />
      <circle
        v-for="p in lo"
        :cx="p.x"
        :cy="p.y"
        :r="circleSize"
        stroke="black"
        stroke-width="3"
        fill="black"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { point_overlap } from "../utils/graphical";

export declare interface Point {
  x: string;
  y: string;
}

export default defineComponent({
  data: () => {
    return {
      lo: [{ x: "50", y: "50" }] as Point[],
      mouseDown: false,
      selectedPoint: undefined as Point | undefined,
      circleSize: 5,
    };
  },
  computed: {
    path() {
      return this.buildPath();
    },
  },
  methods: {
    buildPath() {
      const path = this.lo.reduce((previous, current) => {
        if (previous === "") return `M${current.x} ${current.y}`; //`M{current.x} {current.y}`
        return `${previous} L${current.x} ${current.y}`;
      }, ``);
      console.log("Path: ", path);

      return path;
    },
    handleMouseOut(e: MouseEvent) {
      console.log("Mouse out");
      //this.mouseDown = false;
    },
    handleMouseUp(e: MouseEvent) {
      console.log("Mouse Up");
      const currentPoint = { x: e.layerX, y: e.layerY };

      if (this.selectedPoint) {
        if (
          point_overlap(
            currentPoint.x,
            currentPoint.y,
            +this.selectedPoint.x,
            +this.selectedPoint.y,
            this.circleSize
          )
        ) {
          const i = this.lo.indexOf(this.selectedPoint);
          this.lo.splice(i, 1);
          return;
        }
        const i = this.lo.indexOf(this.selectedPoint);
        console.log("Index:", i);
        this.lo.splice(i, 1);
        const found = this.lo.find((l) => {
          return point_overlap(
            +l.x,
            +l.y,
            currentPoint.x,
            currentPoint.y,
            this.circleSize
          );
        });
        if (!found) this.lo.splice(i, 0, currentPoint);
      } else this.lo.push(currentPoint);

      this.mouseDown = false;
      this.selectedPoint = undefined;
    },
    handleMouseMove(e: MouseEvent) {
      if (this.mouseDown) console.log("Mouse Move");
    },
    handleMouseDown(e: MouseEvent) {
      this.mouseDown = true;
      console.log("testing: ", e.layerX, e.layerY);
      const found = this.lo.find((l) => {
        return point_overlap(+l.x, +l.y, e.layerX, e.layerY, this.circleSize);
      });
      if (found) this.selectedPoint = found;
      console.log("testing: ", this.lo);
    },
  },
});
</script>
