<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Scatter View</div>
    <v-divider></v-divider>
    <div class="flex-grow-1 d-flex flex-column align-center px-2">
      <div class="d-flex flex-row align-center justify-center my-2">
        <v-btn
          v-for="index in cluster_num"
          :key="index"
          :variant="
            selected.cluster == index || selected.cluster == 0
              ? 'outlined'
              : 'text'
          "
          size="small"
          class="text-body-2 font-weight-regular mx-2"
          @click="clickCluster(index)"
        >
          <template v-slot:prepend>
            <div
              :style="{
                backgroundColor: cluster_color[index - 1],
                height: '10px',
                width: '10px',
              }"
              class="rounded-circle"
            ></div>
          </template>
          Cluster{{ index }}</v-btn
        >
      </div>
      <div ref="svg_container" class="w-100 flex-grow-1 border rounded"></div>
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { clusterStore } from "@/store";

export default {
  data() {
    return {
      cluster_num: 3,
      selected: {
        cluster: 0, // 0 标识全选
        stu_IDs: [],
      },
    };
  },
  computed: {
    cluster_result() {
      return clusterStore().result;
    },
    cluster_color(){
        return clusterStore().colors;
    }
  },
  watch: {
    cluster_result() {
      this.draw_scatter();
    },
  },
  mounted() {},
  methods: {
    draw_scatter() {
        console.log(d3.select(this.$refs.svg_container))
      const svg_height = this.$refs.svg_container.clientHeight;
      const svg_width = this.$refs.svg_container.clientWidth;
      const cluster_color = this.cluster_color;
      const data = this.cluster_result;
      d3.select(this.$refs.svg_container).html("");
      const svg = d3
        .select(this.$refs.svg_container)
        .append("svg")
        .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
        .attr("width", svg_width)
        .attr("height", svg_height);
      const padding = 10;
      const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)])
        .range([padding, svg_width - padding]);
      const yScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)])
        .range([padding, svg_height - padding]);
      svg
        .append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 4)
        .attr("fill", (d) => cluster_color[d.cluster])
        .attr("cursor", "pointer")
        .attr("opacity", 0.8);
    },
    clickCluster(index) {
      this.selected.cluster = this.selected.cluster == index ? 0 : index;
      clusterStore().selected = this.selected.cluster;
      console.log(this.cluster_result);
    },
  },
};
</script>
<style scoped></style>
