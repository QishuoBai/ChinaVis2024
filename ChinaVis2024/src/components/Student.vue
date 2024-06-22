<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column ">
    <div class="text-body-1 font-weight-bold">Student View</div>
    <v-divider></v-divider>
    <div
      ref="container"
      class="w-100 h-100 pa-2 overflow-scroll overflow-x-hidden"
      v-if="selected_students.length > 0"
    >
      <v-card
        v-for="(item, index) in selected_students_features"
        :key="index"
        class="my-4 elevation-3"
      >
        <v-card-text>
          <div
            class="d-flex flex-row text-body-2 font-size-10 justify-space-between"
          >
            <v-chip size="small">{{ item.student_ID }}</v-chip>
            <v-chip size="small">{{ item.class }}</v-chip>
            <v-chip size="small">{{ item.major }}</v-chip>
          </div>
          <v-divider class="mt-2"></v-divider>
          <div class="d-flex flex-row text-body-2">
            <div class="w-25 d-flex flex-row align-center justify-center"></div>
            <div class="w-50 d-flex flex-row align-center justify-center">
              <v-btn
                variant="text"
                class="text-body-2"
                @click="changeSelectedFeature()"
                append-icon="mdi-refresh"
                >{{ feature_choices[feature_selected] }}</v-btn
              >
            </div>
            <div class="w-50 d-flex flex-row align-center justify-center">
              <v-btn variant="text" class="text-body-2">Score</v-btn>
            </div>
          </div>
          <div ref="svg_container" style="height: 600px"></div>
        </v-card-text>
      </v-card>
    </div>
    <div
      v-else
      class="flex-grow-1 d-flex flex-row align-center justify-center text-body-2 text-grey"
    >
      Please select some students to start
    </div>
    <div
      v-if="tooltip.show"
      id="student-view-tooltip-card"
      class="rounded-pill bg-grey-lighten-2 text-body-2 d-flex flex-row align-center justify-center pa-2"
      style="position: absolute; height: 30px"
    >
      {{ tooltip.text }}
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { knowledgeCount, subknowledgeCount } from "@/utils/asset";
import student_view_data from "@/data/student_view_data.json";
import { clusterStore } from "@/store";
import stu_features from "@/data/stu_features.json";

const padding_y = 5;
const padding_x = 10;
const sub_knowledge_width = 35;
const width = 300;
const margin2tree = 8;
const max_length = width / 2 - padding_x - sub_knowledge_width - margin2tree;
const rightScale = d3.scaleLinear().domain([0, 1]).range([0, max_length]);

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

export default {
  data() {
    return {
      feature_choices: ["SubmitNum", "TC", "Memory"],
      feature_choices_name: [
        "submit_num_rank_percent",
        "tc_rank_percent",
        "mem_rank_percent",
      ],
      feature_selected: 0,
      tooltip: {
        show: false,
        text: null,
      },
    };
  },
  computed: {
    selected_students() {
      return clusterStore().selected_students;
    },
    selected_students_features() {
      return stu_features.filter((d) =>
        this.selected_students.includes(d.student_ID)
      );
    },
  },
  watch: {
    selected_students() {
      this.$nextTick(() => {
        this.draw();
      });
    },
  },
  mounted() {},
  methods: {
    draw() {
      const selected_students_features = this.selected_students_features;
      selected_students_features.forEach((item, index) => {
        const container_ref = this.$refs.svg_container[index];
        const height = container_ref.clientHeight;
        const student_id = item.student_ID;
        const cluster = clusterStore().result.filter(
          (d) => d.student_ID == student_id
        )[0].cluster;
        // const cluster = 0;
        const bg_color = clusterStore().colors[cluster] + "3e";
        const line_color = clusterStore().colors[cluster];
        d3.select(container_ref).html("");
        const svg = d3
          .select(container_ref)
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height])
          .attr("transform", "translate(35, 0)")
          .attr("overflow", "visible");
        const title_num = student_view_data.titles.length;

        const yScale = d3
          .scaleLinear()
          .domain([0, title_num - 1])
          .range([padding_y, height - padding_y]);
        // 画中间的分隔线
        // svg
        //   .append("g")
        //   .append("line")
        //   .attr("x1", width / 2)
        //   .attr("y1", 0)
        //   .attr("x2", width / 2)
        //   .attr("y2", height)
        //   .attr("stroke", "black")
        //   .attr("stroke-width", 1);
        //   画右侧的背景
        const score_length_scale = d3
          .scaleLinear()
          .domain([0, 4])
          .range([0, max_length]);
        svg
          .append("g")
          .selectAll("line")
          .data(student_view_data.titles)
          .join("line")
          .attr("x1", width / 2 + margin2tree)
          .attr("y1", (d, i) => yScale(i))
          .attr(
            "x2",
            (d) => width / 2 + margin2tree + score_length_scale(d.score)
          )
          .attr("y2", (d, i) => yScale(i))
          .attr("stroke", bg_color)
          .attr("stroke-width", 3)
          .attr("stroke-linecap", "round")
          .style("cursor", "pointer")
          .on("mouseover", (e, d) => {
            this.tooltip.text = d.title_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#student-view-tooltip-card")
                .style("left", e.clientX - 280 + "px")
                .style("top", e.clientY - 15 + "px");
            });
          })
          .on("mouseout", () => {
            this.tooltip.show = false;
          });
        //   画右侧的分数
        svg
          .append("g")
          .selectAll("line")
          .data(student_view_data.titles)
          .join("line")
          .attr("x1", width / 2 + margin2tree)
          .attr("y1", (d, i) => yScale(i))
          .attr(
            "x2",
            (d, i) =>
              width / 2 +
              margin2tree +
              score_length_scale(
                student_view_data.students[student_id][i].best_score
              )
          )
          .attr("y2", (d, i) => yScale(i))
          .style("cursor", "pointer")
          .attr("stroke", line_color)
          .attr("stroke-width", 5)
          .attr("stroke-linecap", "round")
          .on("mouseover", (e, d) => {
            this.tooltip.text = d.title_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#student-view-tooltip-card")
                .style("left", e.clientX - 280 + "px")
                .style("top", e.clientY - 15 + "px");
            });
          })
          .on("mouseout", () => {
            this.tooltip.show = false;
          });
        //   画左侧的背景
        svg
          .append("g")
          .selectAll("line")
          .data(Array.from({ length: title_num }, (_, i) => i))
          .join("line")
          .attr("x1", width / 2)
          .attr("y1", (d, i) => yScale(i))
          .attr("x2", padding_x + sub_knowledge_width + margin2tree)
          .attr("y2", (d, i) => yScale(i))
          .attr("stroke", bg_color)
          .attr("stroke-width", 3)
          .style("cursor", "pointer")
          .attr("stroke-linecap", "round")
          .on("mouseover", (e, d) => {
            this.tooltip.text = student_view_data.titles[d].title_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#student-view-tooltip-card")
                .style("left", e.clientX - 280 + "px")
                .style("top", e.clientY - 15 + "px");
            });
          })
          .on("mouseout", () => {
            this.tooltip.show = false;
          });
        //   画左侧的分数
        svg
          .append("g")
          .classed("g-student-view-right-" + student_id, true)
          .selectAll("circle")
          .data(Array.from({ length: title_num }, (_, i) => i))
          .join("circle")
          .attr("cy", (d) => yScale(d))
          .style("cursor", "pointer")
          .attr("r", 4)
          .attr("fill", line_color)
          .attr(
            "cx",
            (d) =>
              padding_x +
              sub_knowledge_width +
              margin2tree +
              rightScale(
                student_view_data.students[student_id].map(
                  (k) => k[this.feature_choices_name[this.feature_selected]]
                )[d]
              )
          )
          .attr("visibility", (d) =>
            student_view_data.students[student_id].map(
              (k) => k[this.feature_choices_name[this.feature_selected]]
            )[d] == -1
              ? "hidden"
              : "visible"
          )
          .on("mouseover", (e, d) => {
            this.tooltip.text = student_view_data.titles[d].title_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#student-view-tooltip-card")
                .style("left", e.clientX - 280 + "px")
                .style("top", e.clientY - 15 + "px");
            });
          })
          .on("mouseout", () => {
            this.tooltip.show = false;
          });
        // 画树
        const line = d3
          .line()
          .x((d) => d.x)
          .y((d) => d.y)
          .curve(d3.curveBumpX);
        const line_width = 2;
        let sk_title_nums = [];
        let k_sk_nums = [];
        let g = svg.append("g");
        for (let k in student_view_data.knowledges) {
          k_sk_nums.push(Object.keys(student_view_data.knowledges[k]).length);
          for (let sk in student_view_data.knowledges[k]) {
            sk_title_nums.push(student_view_data.knowledges[k][sk].length);
          }
        }
        const x = [
          width / 2 - sub_knowledge_width,
          width / 2 - sub_knowledge_width / 2,
          padding_x,
          padding_x + sub_knowledge_width / 2,
          padding_x + sub_knowledge_width,
        ];
        // const x = [
        //   width / 2 - sub_knowledge_width,
        //   width / 2 - sub_knowledge_width / 2,
        //   width / 2,
        //   width / 2 + sub_knowledge_width / 2,
        //   width / 2 + sub_knowledge_width,
        // ];
        let title_y = Array.from({ length: title_num }, (_, i) => yScale(i));
        let sk_y = [];
        let tmp = 0;
        sk_title_nums.forEach((d) => {
          let cur_sk_y = d3.mean(
            title_y.filter((y, i) => i >= tmp && i < tmp + d)
          );
          sk_y.push(cur_sk_y);
          title_y
            .filter((y, i) => i >= tmp && i < tmp + d)
            .forEach((t_y) => {
              //   g.append("path")
              //     .attr(
              //       "d",
              //       line([
              //         { x: x[0], y: t_y },
              //         { x: x[1], y: cur_sk_y },
              //       ])
              //     )
              //     .attr("stroke", bg_color)
              //     .attr("fill", "none")
              //     .attr("stroke-width", line_width)
              //     .attr("stroke-linecap", "round");
              g.append("path")
                .attr(
                  "d",
                  line([
                    { x: x[4], y: t_y },
                    { x: x[3], y: cur_sk_y },
                  ])
                )
                .attr("stroke", bg_color)
                .attr("fill", "none")
                .attr("stroke-width", line_width)
                .attr("stroke-linecap", "round");
            });
          tmp += d;
        });
        let k_y = [];
        tmp = 0;
        k_sk_nums.forEach((d, i) => {
          let cur_k_y = d3.mean(sk_y.filter((y, i) => i >= tmp && i < tmp + d));
          k_y.push(cur_k_y);
          g.append("text")
            .text(knowledges[i])
            .attr("x", padding_x - margin2tree)
            .attr("y", cur_k_y)
            .style("font-size", "10px")
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "end");
          sk_y
            .filter((y, i) => i >= tmp && i < tmp + d)
            .forEach((t_y) => {
              //   g.append("path")
              //     .attr(
              //       "d",
              //       line([
              //         { x: x[1], y: t_y },
              //         { x: x[2], y: cur_k_y },
              //       ])
              //     )
              //     .attr("stroke", bg_color)
              //     .attr("fill", "none")
              //     .attr("stroke-width", line_width)
              //     .attr("stroke-linecap", "round");
              g.append("path")
                .attr(
                  "d",
                  line([
                    { x: x[3], y: t_y },
                    { x: x[2], y: cur_k_y },
                  ])
                )
                .attr("stroke", bg_color)
                .attr("fill", "none")
                .attr("stroke-width", line_width)
                .attr("stroke-linecap", "round");
            });
          tmp += d;
        });
        // 画一个遮罩层
        svg.append('rect').attr('width', width*3).attr('height', height).attr('fill', 'white').attr('opacity', 0.6).attr('transform', `translate(-${width} 0)`)
      });
    },
    changeSelectedFeature() {
      this.feature_selected = (this.feature_selected + 1) % 3;
      this.selected_students.forEach((sid, index) => {
        const container_ref = this.$refs.svg_container[index];
        d3.select(`.g-student-view-right-${sid}`)
          .selectAll("circle")
          .transition()
          .duration(300)
          .attr(
            "cx",
            (d) =>
              padding_x +
              sub_knowledge_width +
              margin2tree +
              rightScale(
                student_view_data.students[sid].map(
                  (k) => k[this.feature_choices_name[this.feature_selected]]
                )[d]
              )
          );
      });
    },
  },
};
</script>

<style></style>
