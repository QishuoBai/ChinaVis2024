<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div class="text-body-1 font-weight-bold">Scatter View</div>
    <v-divider></v-divider>
    <div class="flex-grow-1 d-flex flex-colomn">
      <div class="TitlesContainer"></div>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import { DownOutlined } from "@ant-design/icons-vue";
import TitleViewData from '../data/TitleViewData.json'
export default {
  data() {
    return {
      SelectedKnowledge:'g7R2j',
      dataobj: null,
      layout: {
        Width: 100,
        Height: 0,
        RO: 30,
        RI: 15,
        LineLen: 200,
        barWidth: 5,
      },
    };
  },
  mounted() {
    const svg = this.init();
    this.drawTitles(svg, this.layout);
    this.drawPerformance(svg, this.layout);
  },
  methods: {
    init() {
      const obj = TitleViewData.find((item) => item.knowledge === this.SelectedKnowledge);
      // 找到其中的各取值范围辅助映射
      this.dataobj = obj
      this.layout.Height = d3.select(".TitlesContainer").node().clientHeight;
      const svg = d3
        .select(".TitlesContainer")
        .append("svg")
        .attr("width", this.dataobj.titleNum * this.layout.Width)
        .attr("height", this.layout.Height)
        .attr("viewBox", [
          0,
          0,
          this.dataobj.titleNum * this.layout.Width,
          this.layout.Height,
        ]);
      return svg;
    },
    drawTitles(svg, layout) {
      const R_OutScale = d3
        .scaleLinear()
        .domain([0, 10])
        .range([layout.RI, layout.RO]);
      const R_InScale = d3
        .scaleLinear()
        .domain([10, 50])
        .range([layout.RI / 3, layout.RI]);
      svg
        .append("g")
        .selectAll("rect")
        .data(this.dataobj.titles)
        .enter()
        .append("rect")
        .attr("x", (d, i) => i * layout.Width)
        .attr("y", 0)
        .attr("width", layout.Width - 2)
        .attr("height", layout.Height)
        // .attr("stroke", "black")
        .attr("fill", "#ddd");
      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("cy", layout.Width / 2)
        .attr("r", (d) => R_OutScale(d.t_mean_sbmnum))
        .attr("fill", "red");
      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("cy", layout.Width / 2)
        .attr("r", (d) => R_InScale(d.t_mean_score))
        .attr("fill", "red");
    },
    // 绘制题目表现
    drawPerformance(svg, layout) {
      // 注意mem表现的比例尺待改
      const mem_scale = d3
        .scaleLinear()
        .domain([128, 65536])
        .range([layout.LineLen, 0]);
      const tc_scale = d3
        .scaleLinear()
        .domain([0, 400])
        .range([layout.LineLen, 0]);

      // 绘制memory表现箱型图
      const g1 = svg
        .append("g")
        .attr(
          "transform",
          (d) => `translate(${-layout.barWidth}, ${layout.Width})`
        )
        .selectAll("line")
        .data(this.dataobj.pfm_mem)
        .enter();

      g1.append("line")
        .attr("x1", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("y1", 0)
        .attr("x2", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("y2", layout.LineLen)
        .style("stroke", "black")
        .style("stroke-width", 1);
      g1.append("rect")
        .attr(
          "x",
          (d, i) => i * layout.Width + layout.Width / 2 - layout.barWidth / 2
        )
        .attr("y", (d, i) => mem_scale(d.t_max_pfm_mem))
        .attr("width", layout.barWidth)
        .attr(
          "height",
          (d, i) => mem_scale(d.t_min_pfm_mem) - mem_scale(d.t_max_pfm_mem)
        )
        // .attr("stroke", "black")
        .attr("fill", "#222");


      // 绘制timeconsume表现箱型图
      const g2 = svg
        .append("g")
        .attr(
          "transform",
          (d) => `translate(${layout.barWidth}, ${layout.Width})`
        )
        .selectAll("line")
        .data(this.dataobj.pfm_tc)
        .enter();

      g2.append("line")
        .attr("x1", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("y1", 0)
        .attr("x2", (d, i) => i * layout.Width + layout.Width / 2)
        .attr("y2", layout.LineLen)
        .style("stroke", "black")
        .style("stroke-width", 1);
      g2.append("rect")
        .attr(
          "x",
          (d, i) => i * layout.Width + layout.Width / 2 - layout.barWidth / 2
        )
        .attr("y", (d, i) => tc_scale(d.t_max_pfm_tc))
        .attr("width", layout.barWidth)
        .attr(
          "height",
          (d, i) => tc_scale(d.t_min_pfm_tc) - tc_scale(d.t_max_pfm_tc)
        )
        // .attr("stroke", "black")
        .attr("fill", "#222");
    },
  },
};
</script>
<style scoped>
.TitlesContainer {
  width: 50%;
  height: 100%;
  background-color: rgb(237, 237, 237);
}
</style>
