<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Student View</div>
    <v-divider></v-divider>
    <div ref="container" class="w-100 h-100"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  data() {
    return {
      layout: {
        Width: 0,
        Height: 0,
      },
    };
  },
  mounted() {
    const svg = this.init();
    this.draw(svg, this.layout);
  },
  methods: {
    init() {
      this.layout.Width = d3.select(this.$refs.container).node().clientWidth;
      this.layout.Height = d3.select(this.$refs.container).node().clientHeight;
      console.log(this.layout);
      const svg = d3
        .select(this.$refs.container)
        .append("svg")
        .attr("width", this.layout.Width)
        .attr("height", this.layout.Height)
        .attr("viewBox", [0, 0, this.layout.Width, this.layout.Height]);
      return svg;
    },
    draw(svg, layout){
        // TBD
    }
  },
};
</script>
