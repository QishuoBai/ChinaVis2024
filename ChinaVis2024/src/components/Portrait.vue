<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column" style="width: 0px">
    <div class="d-flex flex-row justify-space-between align-center">
      <div class="text-body-1 font-weight-bold">Portrait View</div>
    </div>
    <v-divider></v-divider>
    <div class="flex-grow-1 mt-2 d-flex flex-row" style="height: 0px">
      <div
        style="width: 80%"
        class="d-flex flex-row rounded elevation-2 border-thin"
      >
        <div
          v-for="index in cluster_num"
          :key="index"
          ref="svg_container"
          :class="
            'h-100 flex-shrink-0 rounded' +
            (selected_cluster == index || selected_cluster == 0
              ? ' elevation-2'
              : '')
          "
          :style="{
            border:
              (selected_cluster == index || selected_cluster == 0 ? '1' : '0') +
              'px solid black',
            width: '33%',
          }"
        ></div>
      </div>
      <div style="margin-left: 70px; width: 12%">
        <div ref="legend-1" class="h-50 w-100"></div>
        <div ref="legend-2" class="h-50 w-100"></div>
      </div>
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { ks, knowledgeOrder } from "@/utils/asset";
import { clusterStore } from "@/store";

const knowledges = ks;

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
const features_label = [
  "Score",
  "Rank",
  "Enthusiasm",
  "Explore",
  "TC Bonus",
  "Mem Bonus",
  "Error-Free Bonus",
  "Test-Free Bonus",
];

export default {
  data() {
    return {
      cluster_num: 3,
    };
  },
  computed: {
    selected_cluster() {
      return clusterStore().selected_cluster;
    },
    cluster_result() {
      return clusterStore().result;
    },
    cluster_color() {
      return clusterStore().colors;
    },
    selected_students() {
      return clusterStore().selected_students;
    },
  },
  watch: {
    cluster_result() {
      [1, 2, 3].forEach((cid) => {
        this.draw_cluster(cid);
        this.draw_legend();
      });
    },
    selected_students() {
      [1, 2, 3].forEach((cid) => {
        this.draw_cluster(cid);
        this.draw_legend();
      });
    },
  },
  mounted() {
    this.draw_legend();
  },
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
      g.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r / 2)
        .style("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", 1);
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI / 4);
        const x2 = centerX + (r + bar_height) * Math.cos(angle);
        const y2 = centerY + (r + bar_height) * Math.sin(angle);
        g.append("line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", x2)
          .attr("y2", y2)
          .attr("stroke", "lightgray")
          .attr("stroke-dasharray", "5,5")
          .attr("stroke-width", 1);
      }
      //   画一个对知识点的透明圆环背景，点击时高亮
      g.append("g")
        .attr("transform", `translate(${centerX} ${centerY})`)
        .selectAll("path")
        .data(knowledges)
        .join("path")
        .attr("class", (d) => `knowledge-highlight knowledge-${d.split(' ')[0]}-highlight`)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(r)
            .outerRadius(r + bar_height)
            .startAngle((d, i) => i * (Math.PI / 4))
            .endAngle((d, i) => (i + 1) * (Math.PI / 4))
            .padAngle(0.01)
        )
        .attr("fill", this.cluster_color[cid - 1])
        .attr("stroke", "none")
        .attr("cursor", "pointer")
        .attr("visibility", d => (clusterStore().selected_knowledge == d)?'visible':'hidden')
        .attr("opacity", 0.3);
      let cur_cluster_stuids = this.cluster_result
        .filter((d) => d.cluster == cid - 1)
        .map((d) => d.student_ID);
      //   console.log(cur_cluster_stuids);
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
      //   console.log(sub_knowledges_scores);
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
                .padAngle(0.028)
            )
            .attr("fill", this.cluster_color[cid - 1])
            .attr("fill-opacity", 0.8)
            .attr("stroke", this.cluster_color[cid - 1]);
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
      //   console.log(features_score);
      const radarLine = d3
        .line()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveLinearClosed);
      let g_inner = g
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`);
      // 创建渐变
      const defs = svg.append("defs");
      const gradient = defs
        .append("radialGradient")
        .attr("id", `radial-gradient-${cid}`)
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "100%")
        .attr("fx", "50%")
        .attr("fy", "50%");

      // 定义渐变的颜色
      gradient
        .append("stop")
        .attr("offset", "0%")
        // .attr("stop-color", this.cluster_color[cid - 1])
        .attr("stop-color", '#fff')
        .attr("stop-opacity", 0);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", this.cluster_color[cid - 1])
        .attr("stop-opacity", 1);
      g_inner
        .append("path")
        .datum(features_xy)
        .attr("d", radarLine)
        .attr("fill", `url(#radial-gradient-${cid})`)
        .attr("fill-opacity", 1)
        .attr("stroke", this.cluster_color[cid - 1])
        .attr("stroke-width", 2);
      // 画高亮学生
      const selected_students = this.selected_students.filter((d) =>
        cur_cluster_stuids.includes(d)
      );
      if (selected_students.length > 0) {
        filtered_students = stu_features.filter((d) =>
          selected_students.includes(d.student_ID)
        );
        knowledges_score = [];
        knowledges.forEach((k) => {
          knowledges_score.push(
            d3.mean(filtered_students, (d) => d.knowledge_score[k])
          );
        });
        sub_knowledges_scores = [];
        sub_knowledges.forEach((k) => {
          sub_knowledges_scores.push(
            d3.mean(filtered_students, (d) => d.sub_knowledge_score[k])
          );
        });
        startAngle = 0;
        sub_index = 0;
        g_outer = g
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
              .attr("fill", "none")
              .attr("stroke", "black")
              .attr("stroke-width", 2);
            startAngle = endAngle;
            sub_index++;
          }
        });
        features_score = [];
        features.forEach((f) => {
          features_score.push(d3.mean(filtered_students, (d) => d.features[f]));
        });
        features_xy = [];
        features_score.forEach((d, i) => {
          let r_length;
          r_length = inner_scale(d);
          let x = r_length * Math.cos(angleStep * i - Math.PI / 2);
          let y = r_length * Math.sin(angleStep * i - Math.PI / 2);
          features_xy.push({ x: x, y: y });
        });
        g_inner = g
          .append("g")
          .attr("transform", `translate(${centerX} ${centerY})`);
        g_inner
          .append("path")
          .datum(features_xy)
          .attr("d", radarLine)
          .attr("fill", "none")
          .attr("fill-opacity", 0.5)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
      }
      //   画一个对知识点的透明圆环，以供点击
      g.append("g")
        .attr("transform", `translate(${centerX} ${centerY})`)
        .selectAll("path")
        .data(knowledges)
        .join("path")
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(r)
            .outerRadius(r + bar_height)
            .startAngle((d, i) => i * (Math.PI / 4))
            .endAngle((d, i) => (i + 1) * (Math.PI / 4))
            .padAngle(0.01)
        )
        .attr("fill", "transparent")
        .attr("stroke", "none")
        .attr("cursor", "pointer")
        .on("click", (e, d) => {
        //   console.log(d);
          if (clusterStore().selected_knowledge == d) {
            clusterStore().selected_knowledge = "";
          } else {
            clusterStore().selected_knowledge = d;
          }
          this.highlightSelectedKnowledge();
        });
    },
    draw_legend() {
      const height = this.$refs["legend-1"].clientHeight;
      const width = this.$refs["legend-1"].clientWidth;
      let centerX = width / 2;
      let centerY = height / 2;
      d3.select(this.$refs["legend-1"]).html("");
      d3.select(this.$refs["legend-2"]).html("");
      // legend1
      let r1 = 40;
      let r2 = 50;
      let svg = d3
        .select(this.$refs["legend-1"])
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .attr("overflow", "visible");

      svg
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`)
        .selectAll("path")
        .data(knowledges)
        .join("path")
        .attr("class", (d) => `knowledge-legend knowledge-legend-${d.split(' ')[0]}`)
        .attr(
          "d",
          d3
            .arc()
            .innerRadius(r1)
            .outerRadius(r2)
            .startAngle((d, i) => i * (Math.PI / 4))
            .endAngle((d, i) => (i + 1) * (Math.PI / 4))
            .padAngle(0.01)
        )
        // .attr("fill", (d, i) => this.cluster_color[0])
        .attr("fill", '#757575')
        .attr("opacity", (d) =>
          clusterStore().selected_knowledge == "" ||
          clusterStore().selected_knowledge == d
            ? 0.8
            : 0.25
        );
      svg
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`)
        .selectAll("text")
        .data(knowledges)
        .join("text")
        .text((d) => d)
        .attr("text-anchor", (d, i) => (i < 4 ? "start" : "end"))
        .attr("alignment-baseline", "middle")
        .attr(
          "x",
          (d, i) =>
            r2 * Math.cos(i * (Math.PI / 4) + Math.PI / 8 - Math.PI / 2) +
            (i < 4 ? 5 : -5)
        )
        .attr(
          "y",
          (d, i) => r2 * Math.sin(i * (Math.PI / 4) + Math.PI / 8 - Math.PI / 2)
        )
        .attr("font-size", 10);
      svg
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY - 10})`)
        .append("text")
        .text("Mastery")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10);
      svg
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY})`)
        .append("text")
        .text("of")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10);
      svg
        .append("g")
        .attr("transform", `translate(${centerX} ${centerY + 10})`)
        .append("text")
        .text("Knowledges")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10);
      // legend2
      centerY -= 20;
      svg = d3
        .select(this.$refs["legend-2"])
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", width)
        .attr("height", height)
        .attr("overflow", "visible");
      svg
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r1)
        .attr("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5,5");
      svg
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", r1 / 2)
        .style("fill", "none")
        .attr("stroke", "lightgray")
        .attr("stroke-dasharray", "5,5");

      svg
        .append("g")
        .selectAll("line")
        .data(features)
        .join("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr(
          "x2",
          (d, i) => centerX + r1 * Math.cos(i * (Math.PI / 4) - Math.PI / 2)
        )
        .attr(
          "y2",
          (d, i) => centerY + r1 * Math.sin(i * (Math.PI / 4) - Math.PI / 2)
        )
        .attr("stroke", (d) =>
          clusterStore().features4cluster.includes(d) ? "black" : "lightgray"
        )
        .attr("stroke-dasharray", (d) =>
          clusterStore().features4cluster.includes(d) ? "none" : "5,5"
        )
        .attr("stroke-width", (d) =>
          clusterStore().features4cluster.includes(d) ? 1 : 1
        );
      svg
        .append("g")
        .selectAll("text")
        .data(features_label)
        .join("text")
        .text((d) => d)
        .attr(
          "x",
          (d, i) =>
            centerX + (r1 + 2) * Math.cos(i * (Math.PI / 4) - Math.PI / 2)
        )
        .attr(
          "y",
          (d, i) =>
            centerY + (r1 + 2) * Math.sin(i * (Math.PI / 4) - Math.PI / 2)
        )
        .attr("font-size", 10)
        .attr("text-anchor", (d, i) => {
          if (i == 0 || i == 4) return "middle";
          if (i < 4) return "start";
          return "end";
        })
        .attr("alignment-baseline", "middle");
      const label_mt = 25;
      let g = svg.append("g").attr("transform", `translate(-30 0)`);
      g.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY + r1 + label_mt)
        .attr("x2", centerX - r1)
        .attr("y2", centerY + r1 + label_mt)
        .attr("stroke", "black")
        .attr("stroke-width", 1);
      g.append("text")
        .attr("x", centerX + 5)
        .attr("y", centerY + r1 + label_mt)
        .text("features for cluster")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");
      g.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY + r1 + label_mt + 15)
        .attr("x2", centerX - r1)
        .attr("y2", centerY + r1 + label_mt + 15)
        .attr("stroke", "grey").attr('stroke-dasharray','4,5')
        .attr("stroke-width", 1);
      g.append("text")
        .attr("x", centerX + 5)
        .attr("y", centerY + r1 + label_mt + 15)
        .text("features")
        .attr("font-size", 10)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "middle");
    },
    highlightSelectedKnowledge() {
      d3.selectAll(".knowledge-highlight").attr("visibility", "hidden");
      d3.selectAll(".knowledge-legend").attr("opacity", (d) =>
        clusterStore().selected_knowledge == "" ||
        clusterStore().selected_knowledge == d
          ? 0.8
          : 0.25
      );
      if (clusterStore().selected_knowledge != "") {
        d3.selectAll(
          `.knowledge-${clusterStore().selected_knowledge.split(' ')[0]}-highlight`
        ).attr("visibility", "visible");
      }
    },
  },
};
</script>
<style></style>
