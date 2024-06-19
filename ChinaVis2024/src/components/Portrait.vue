<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Portrait View</div>
    <v-divider></v-divider>
    <div class="flex-grow-1 mt-2" style="height: 0px">
      <div
        ref="svg_container"
        class="h-100 w-100 border rounded overflow-hidden"
      ></div>
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { knowledgeOrder } from "@/utils/asset";

const knowledges = [
  "b3C9s",
  "g7R2j",
  "k4W1c",
  "m3D1v",
  "r8S3g",
  "s8Y2f",
  "t5V9e",
  "y9W5d",
];

const sub_knowledges = knowledgeOrder.array;
const knowledges_sub_nums = knowledgeOrder.group.map((d) => d.length);
const features = [
  "st_rank",
  "st_pfm_mem",
  "st_exploreNum",
  "st_time_l",
  "st_time_mean",
  "st_time_f",
  "st_testNum",
  "st_pfm_tc",
];

export default {
  data() {
    return {
      cluster_num: 3,
    };
  },
  computed: {
    selected_group() {
      return 1;
    },
    select_stu_IDs() {
      return [1, 2];
    },
    svg_height() {
      return this.$refs.svg_container.clientHeight;
    },
    svg_width() {
      return this.$refs.svg_container.clientWidth;
    },
    r() {
      return Math.min(this.svg_height, this.svg_width) * 0.25;
    },
    bar_height() {
      return 60;
    },
  },
  mounted() {
    this.init_portrait();
  },
  methods: {
    init_portrait() {
      const svg_height = this.svg_height;
      const svg_width = this.svg_width;
      const centerX = this.svg_width / 2;
      const centerY = this.svg_height / 2;

      const r = this.r;
      const bar_height = this.bar_height;

      const svg = d3
        .select(this.$refs.svg_container)
        .append("svg")
        .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
        .attr("width", svg_width)
        .attr("height", svg_height);
      // 画辅助线
      let g = svg.append("g");
      g.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r + bar_height)
        .style("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 1);
      g.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r)
        .style("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 1);
      const angleStep = Math.PI / 4;
      for (let i = 0; i < 8; i++) {
        const angle = i * angleStep;
        const x2 = centerX + r * Math.cos(angle);
        const y2 = centerY + r * Math.sin(angle);
        svg
          .append("line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "lightgray")
          .attr("stroke-dasharray", "5,5")
          .attr("stroke-width", 1);
      }
      svg
        .append("g")
        .attr("id", "g-content")
        .attr("transform", `translate(${centerX} ${centerY})`);
      this.draw_group(2);
    },
    draw_group(gid) {
      const svg_height = this.svg_height;
      const svg_width = this.svg_width;
      const centerX = this.svg_width / 2;
      const centerY = this.svg_height / 2;

      const r = this.r;
      const bar_height = this.bar_height;

      let filtered_students;
      const cluster_num = this.cluster_num;

      if (gid == 0) {
        filtered_students = stu_features;
      } else {
        filtered_students = stu_features.filter(
          (d) => d.cluster[cluster_num - 1] == gid - 1
        );
      }
      // 清除内容
      const g = d3.select(this.$refs.svg_container).select("#g-content");
      g.html("");
      //   画外圈
      let knowledges_score = [];
      knowledges.forEach((k) => {
        knowledges_score.push(
          d3.mean(filtered_students, (d) => d.knowledge_score[k])
        );
      });
      let sub_knowledges_scores = [];
      sub_knowledges.forEach((k) => {
        sub_knowledges_scores.push(
          d3.mean(filtered_students, (d) => d.sub_knowledge_score[k])
        );
      });
      console.log(knowledges_score);
      const bar_height_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, bar_height]);
      let startAngle = 0;
      let sub_index = 0;

      let g_outer = g.append("g");
      knowledges.forEach((d, i) => {
        const sub_num = knowledges_sub_nums[i];
        const angleStep = Math.PI / 4 / sub_num;
        for (let j = 0; j < sub_num; j++) {
          const endAngle = startAngle + angleStep;
          g_outer
            .append("path")
            .attr(
              "d",
              d3
                .arc()
                .innerRadius(r)
                .outerRadius(
                  r + bar_height_scale(sub_knowledges_scores[sub_index])
                )
                .startAngle(startAngle)
                .endAngle(endAngle)
                .padAngle(0.01)
            )
            .attr("fill", "grey")
            .attr("opacity", 0.1);
          startAngle = endAngle;
          sub_index++;
        }
      });
      //   画内圈
      let features_score = [];
      features.forEach((f) => {
        features_score.push(d3.mean(filtered_students, (d) => d[f]));
      });
      let features_xy = [];
      const inner_01_scale = d3.scaleLinear().domain([0, 1]).range([0, r]);
      const inner_time_scale = d3.scaleLinear().domain([0, 10]).range([0, r]);
      const angleStep = Math.PI / 4;
      features_score.forEach((d, i) => {
        let r_length;
        if (i == 2 || i == 6) {
          r_length = inner_time_scale(d);
        } else {
          r_length = inner_01_scale(d);
        }
        let x = r_length * Math.cos(angleStep * i - Math.PI / 2);
        let y = r_length * Math.sin(angleStep * i - Math.PI / 2);
        features_xy.push({ x: x, y: y });
      });
      console.log(features_score);
      const radarLine = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinearClosed);
      let g_inner = g.append("g");
      g_inner
        .append("path")
        .datum(features_xy)
        .attr("d", radarLine)
        .attr("fill", "none")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "black")
        .attr("stroke-width", 2);
    },
  },
};
</script>
<style scoped></style>
