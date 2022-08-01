<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div>
    <svg
      :style="baseStyle"
      :viewBox="getBoxSize"
      :onmousedown="handleMouseDown"
      :onmousemove="handleMouseMove"
      :onmouseup="handleMouseUp"
      :onmouseout="handleMouseOut"
    >
      <path :d="border" stroke="black" stroke-width="1" fill="white" />

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
  props: {
    boxSize: {
      type: Number,
      default: 300,
    },
  },
  data: () => {
    return {
      lo: [] as Point[],
      mouseDown: false,
      selectedPoint: undefined as Point | undefined,
      circleSize: 5,
    };
  },
  computed: {
    path() {
      return this.buildPath();
    },
    border() {
      return this.buildBorder();
    },
    baseStyle() {
      return `width: ${this.boxSize}; height: ${this.boxSize}`;
    },
  },
  methods: {
    buildBorder() {
      return `M0 0 H0 ${this.boxSize} V${this.boxSize} ${this.boxSize} H${this.boxSize} 0 Z`;
    },
    getBoxSize() {
      return `0 0 ${this.boxSize} ${this.boxSize}`;
    },
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

      // In case an existing point was dragged:
      if (this.selectedPoint) {
        const i = this.lo.indexOf(this.selectedPoint);

        // if an existing point was not moved, but just clicked, then remove that point.
        if (
          point_overlap(
            currentPoint.x,
            currentPoint.y,
            +this.selectedPoint.x,
            +this.selectedPoint.y,
            this.circleSize
          )
        ) {
          this.lo.splice(i, 1);
          this.$emit("remove", this.selectedPoint);
          return;
        }
        // Otherwise remove the old point and insert the new point at the same index as the selected point
        const found = this.lo.find((l) => {
          return point_overlap(
            +l.x,
            +l.y,
            currentPoint.x,
            currentPoint.y,
            this.circleSize
          );
        });
        // but do this only if the point doesn't already exist.
        if (!found) {
          this.lo.splice(i, 1);
          this.lo.splice(i, 0, currentPoint);
          this.$emit("replace", { old: this.selectedPoint, new: currentPoint });
        }
      }
      // otherwise just add the new point.
      else {
        this.lo.push(currentPoint);
        this.$emit("add", currentPoint);
      }

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
