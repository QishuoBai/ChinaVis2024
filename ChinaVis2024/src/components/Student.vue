<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Student View</div>
    <v-divider></v-divider>
    <a-input-search
      v-model:value="value"
      placeholder="Input Student ID"
      enter-button
      @search="onSearch"
    />
    <div ref="container" class="w-100 h-100"></div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { knowledgeCount, subknowledgeCount } from "@/utils/asset";
import StuViewData_title from "../data/StuViewData_title.json";
import StuTitlePerfom from "../data/StuTitlePerfom.json";
export default {
  data() {
    return {
      studentID: "01qkq6w2v62cimidb3b7",
      layout: {
        Width: 0,
        Height: 0,
        MarginTop: 50,
        barWidth: 18,
      },
    };
  },
  mounted() {
    const svg = this.init();
    this.drawBackground(svg, this.layout);
  },
  methods: {
    init() {
      this.layout.Width = d3.select(this.$refs.container).node().clientWidth;
      this.layout.Height = d3.select(this.$refs.container).node().clientHeight;
      const svg = d3
        .select(this.$refs.container)
        .append("svg")
        .attr("width", this.layout.Width)
        .attr("height", this.layout.Height)
        .attr("viewBox", [0, 0, this.layout.Width, this.layout.Height]);
      return svg;
    },
    SelectedStudent(id) {
      return StuTitlePerfom.find((item) => item.sid === id);
    },
    drawBackground(svg, layout) {
      const stuPerform = StuTitlePerfom.find(
        (item) => item.sid === this.studentID
      );
      const color = d3.scaleOrdinal(d3.schemeAccent);
      const g = svg.append("g").attr("name", "BarGroup_knowledge");
      const g1 = g.append("g").attr("name", "knowledges");
      const g2 = g
        .append("g")
        .attr("name", "sub_knowledges")
        .attr("transform", () => `translate(${this.layout.barWidth}, ${0})`);
      const g3 = g
        .append("g")
        .attr("name", "sub_knowledges")
        .attr(
          "transform",
          () => `translate(${2 * this.layout.barWidth}, ${0})`
        );
      let base = 0;
      StuViewData_title.forEach((k_obj, i) => {
        // 主知识点块

        g1.append("rect")
          .attr("name", k_obj.knowledge)
          .attr("count", k_obj.titNum)
          .attr("x", 0)
          .attr("y", base * this.layout.barWidth)
          .attr("width", 25)
          .attr("height", k_obj.titNum * this.layout.barWidth)
          .attr("fill", color(i))
          .style("stroke", "black") // 设置边框颜色为黑色
          .style("stroke-width", 1);

        g1.append("text")
          .text("k" + (i + 1))
          .attr("x", 0)
          .attr("y", base * this.layout.barWidth + 15)
          .attr("fill", "black")
          .attr("font-size", 15)
          .attr("text-anchor", "start");

        // 子知识点块

        let base2 = 0;
        k_obj.skarr.forEach((sk_obj, j) => {
          g2.append("rect")
            .attr("name", sk_obj.sk)
            .attr("count", sk_obj.titlesNum)
            .attr("x", 0)
            .attr("y", (base + base2) * this.layout.barWidth)
            .attr("width", this.layout.barWidth)
            .attr("height", sk_obj.titlesNum * this.layout.barWidth)
            // .attr("fill", "#888")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("fill", color(j));
          // g2.append("text")
          //   .text("sk" + (j + 1))
          //   .attr("x", 0)
          //   .attr(
          //     "y",
          //     base * this.layout.barWidth + base2 * this.layout.barWidth
          //   )
          //   .attr("fill", "white")
          //   .attr("font-size", 10)
          //   .attr("text-anchor", "start");
          let base3 = 0;
          sk_obj.titles.forEach((t_obj, k) => {
            g3.append("rect")
              .attr("title_name", t_obj.tid)
              .attr("fullscore", t_obj.fs)
              .attr("x", 0)
              .attr("y", (base + base2 + base3) * this.layout.barWidth + 1)
              .attr("width", this.layout.barWidth * t_obj.fs)
              .attr("height", this.layout.barWidth - 2)
              .attr("fill", "#ddd");
            const maxscore = stuPerform.scores.find(
              obj => obj.tid === t_obj.tid
            );
            // 该题最高得分
            g3.append("rect")
              .attr("x", 0)
              .attr("y", (base + base2 + base3) * this.layout.barWidth + 1)
              .attr("width", this.layout.barWidth * maxscore.maxscore)
              .attr("height", this.layout.barWidth - 2)
              .attr("fill", "black");
            base3 += 1;
          });
          base2 += sk_obj.titlesNum;
        });
        base += k_obj.titNum;
      });
    },
    onSearch(id) {
      this.studentID = id;
      console.log(this.studentID);
    },
  },
};
</script>
