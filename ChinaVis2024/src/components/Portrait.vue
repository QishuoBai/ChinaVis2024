<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Portrait View</div>
    <v-divider></v-divider>
    <div class="flex-grow-1 mt-2 d-flex flex-row" style="height: 0px">
      <div style="width: 85%" class="d-flex flex-row rounded">
        <div
          v-for="index in cluster_num"
          :key="index"
          ref="svg_container"
          :class="
            'h-100 flex-shrink-0 rounded mx-1' +
            (selected_cluster == index || selected_cluster == 0
              ? ' elevation-2'
              : '')
          "
          :style="{
            border:
              (selected_cluster == index || selected_cluster == 0
                ? '1'
                : '0') + 'px solid black'
          }"
          style="width: 33%"
        ></div>
      </div>
      <div class="flex-grow-1"></div>
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { knowledgeOrder } from "@/utils/asset";
import { clusterStore } from "@/store";

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
  "score_bonus",
  "rank_bonus",
  "enthusiasm_bonus",
  "explore_bonus",
  "tc_bonus",
  "mem_bonus",
  "_error_type_penalty",
  "_test_num_penalty",
];

export default {
  data() {
    return {
      cluster_num: 3,
    };
  },
  computed: {
    selected_cluster() {
      return clusterStore().selected;
    },
    cluster_result() {
      return clusterStore().result;
    },
    cluster_color() {
      return clusterStore().colors;
    },
  },
  watch: {
    cluster_result() {
      [1, 2, 3].forEach((cid) => {
        this.draw_cluster(cid);
      });
    },
  },
  mounted() {},
  methods: {
    draw_cluster(cid) {
      const svg_height = this.$refs.svg_container[cid - 1].clientHeight;
      const svg_width = this.$refs.svg_container[cid - 1].clientWidth;
      const centerX = svg_width / 2;
      const centerY = svg_height / 2;

      const r = Math.min(svg_height, svg_width) * 0.25;
      const bar_height = 60;
      const container = d3.select(this.$refs.svg_container[cid - 1]);
      container.html("");
      const svg = container
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
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI / 4);
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
      let cur_cluster_stuids = this.cluster_result
        .filter((d) => d.cluster == cid - 1)
        .map((d) => d.student_ID);
      console.log(cur_cluster_stuids);

      const cluster_num = this.cluster_num;
      let filtered_students = stu_features.filter((d) =>
        cur_cluster_stuids.includes(d.student_ID)
      );
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
      console.log(sub_knowledges_scores);
      const bar_height_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, bar_height]);
      let startAngle = 0;
      let sub_index = 0;

      let g_outer = g
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`);
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
            .attr("fill", this.cluster_color[cid - 1])
            .attr("opacity", 0.8);
          startAngle = endAngle;
          sub_index++;
        }
      });
      //   画内圈
      let features_score = [];
      features.forEach((f) => {
        features_score.push(d3.mean(filtered_students, (d) => d.features[f]));
      });
      let features_xy = [];
      const inner_scale = d3.scaleLinear().domain([0, 1]).range([0, r]);
      const angleStep = Math.PI / 4;
      features_score.forEach((d, i) => {
        let r_length;
        r_length = inner_scale(d);
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
      let g_inner = g
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`);
      g_inner
        .append("path")
        .datum(features_xy)
        .attr("d", radarLine)
        .attr("fill", "none")
        .attr("fill-opacity", 0.5)
        .attr("stroke", this.cluster_color[cid - 1])
        .attr("stroke-width", 2);
    },
  },
};
</script>
<style scoped></style>
