<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Scatter View</div>
    <v-divider></v-divider>
    <div class="d-flex flex-row justify-between mt-2 mb-n3">
      <div class="flex-grow-1">
        <v-select
          label="Class"
          :items="classes"
          variant="outlined"
          density="compact"
          clearable
        ></v-select>
      </div>
      <div class="px-1"></div>
      <div class="flex-grow-1">
        <v-select
          label="Major"
          :items="majors"
          variant="outlined"
          density="compact"
          clearable
        ></v-select>
      </div>
      <div class="px-1"></div>
      <div class="flex-grow-1">
        <v-select
          label="Gender"
          :items="genders"
          variant="outlined"
          density="compact"
          clearable
        ></v-select>
      </div>
    </div>
    <div class="flex-grow-1 d-flex flex-row">
      <div ref="svg_container" class="h-100 w-75 border rounded"></div>
      <div class="flex-grow-1 d-flex flex-column align-center">
        <v-btn
          v-for="index in cluster_num"
          :key="index"
          :variant="(selected.group == index || selected.group == 0)?'outlined':'text'"
          class="text-body-2 font-weight-regular my-1"
          @click="clickGroup(index)"
        >
          <template v-slot:prepend>
            <div :style="{backgroundColor: cluster_color[index-1], height:'10px', width:'10px'}" class="rounded-circle"></div>
          </template>
          Group{{ index }}</v-btn
        >
      </div>
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";

export default {
  data() {
    return {
      value: "Class1",
      classes: Array.from({ length: 15 }, (_, i) => `Class${i + 1}`),
      majors: ["J23517", "J40192", "J57489", "J78901", "J87654"],
      genders: ["male", "female"],
      age_min: 18,
      age_max: 24,
      student_IDs: stu_features.map((item) => item.student_ID),
      cluster_num: 3,
      cluster_color: d3.schemeCategory10,
      selected: {
        class: "",
        major: "",
        gender: "",
        group: 0, // 0 标识全选
        stu_IDs: [],
      }
    };
  },
  computed: {},
  mounted() {
    this.init_scatter();
  },
  methods: {
    init_scatter() {
      const svg_height = this.$refs.svg_container.clientHeight;
      const svg_width = this.$refs.svg_container.clientWidth;
      const cluster_color = this.cluster_color;

      const svg = d3
        .select(this.$refs.svg_container)
        .append("svg")
        .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
        .attr("width", svg_width)
        .attr("height", svg_height);
      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(stu_features, (d) => d.tsne_x),
          d3.max(stu_features, (d) => d.tsne_x),
        ])
        .range([0, svg_width]);
      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(stu_features, (d) => d.tsne_y),
          d3.max(stu_features, (d) => d.tsne_y),
        ])
        .range([0, svg_height]);
      // 绘制坐标轴
    //   svg
    //     .append("g")
    //     .append("rect")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("width", svg_width)
    //     .attr("height", svg_height)
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 1);
      // 绘制点
      svg
        .append("g")
        .selectAll("circle")
        .data(stu_features)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.tsne_x))
        .attr("cy", (d) => yScale(d.tsne_y))
        .attr("r", 4)
        .attr("fill", (d) => cluster_color[d.cluster[this.cluster_num - 1]])
        .attr("cursor", "pointer")
        .attr("opacity", 0.8);
    },
    clickGroup(index){
        this.selected.group = (this.selected.group == index?0:index);
    }
  },
};
</script>
<style scoped>

</style>
