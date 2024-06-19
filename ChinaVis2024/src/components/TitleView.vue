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
import TitleViewData from "../data/TitleViewData.json";
export default {
  data() {
    return {
      SelectedKnowledge: "b3C9s",
      dataobj: null,
      layout: {
        Width: 0,
        Height: 100,
        RO: 30,
        RI: 15,
        LineLen: 200,
        barWidth: 10,
      },
    };
  },
  mounted() {
    const svg = this.init();
    this.drawTitles(svg, this.layout);
    this.drawPerformance(svg, this.layout);
    this.drawScore(svg, this.layout);
  },
  methods: {
    init() {
      this.dataobj = TitleViewData.find(
        (item) => item.knowledge === this.SelectedKnowledge
      );
      this.layout.Width = d3.select(".TitlesContainer").node().clientWidth;
      const svg = d3
        .select(".TitlesContainer")
        .append("svg")
        .attr("width", this.layout.Width)
        .attr("height", this.dataobj.titleNum * this.layout.Height)
        .attr("viewBox", [
          0,
          0,
          this.layout.Width,
          this.layout.Height * this.dataobj.titleNum,
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
        .attr("x", 0)
        .attr("y", (d, i) => i * layout.Height)
        .attr("width", layout.Width)
        .attr("height", layout.Height - 2)
        // .attr("stroke", "black")
        .attr("fill", "#ddd");
      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", layout.Height / 2)
        .attr("cy", (d, i) => i * layout.Height + layout.Height / 2)
        .attr("r", (d) => R_OutScale(d.t_mean_sbmnum))
        .attr("fill", "red");
      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", layout.Height / 2)
        .attr("cy", (d, i) => i * layout.Height + layout.Height / 2)
        .attr("r", (d) => R_InScale(d.t_mean_score))
        .attr("fill", "red");
    },
    // 绘制题目表现
    drawPerformance(svg, layout) {
      const mem_scale = d3
        .scaleLinear()
        .domain([128, 65536])
        .range([0,layout.LineLen]);
      const tc_scale = d3
        .scaleLinear()
        .domain([0, 400])
        .range([0, layout.LineLen]);

      // 绘制memory表现箱型图
      const g1 = svg
        .append("g")
        .attr("transform", (d) => `translate(${layout.Height}, 0)`)
        .selectAll("line")
        .data(this.dataobj.titles)
        .enter()
      g1.append("line")
        .attr("x1", 0)
        .attr("y1", (d, i) => i * layout.Height + layout.Height / 2)
        .attr("x2", layout.LineLen)
        .attr("y2", (d, i) => i * layout.Height + layout.Height / 2)
        .style("stroke", "grey")
        .style("stroke-width", 0.5);
      g1.append("line")
        .attr("x1", (d, i) => mem_scale(d.t_mean_pfm_mem))
        .attr("y1", (d, i) => i * layout.Height + layout.Height / 2 - layout.barWidth )
        .attr("x2", (d, i) => mem_scale(d.t_mean_pfm_mem))
        .attr("y2", (d, i) => i * layout.Height + layout.Height / 2 + layout.barWidth)
        .style("stroke", "red")
        .style("stroke-width", 1);
      g1.append("rect")
        .attr(
          "y",
          (d, i) => i * layout.Height + layout.Height / 2 - layout.barWidth / 2
        )
        .attr("x", (d, i) => mem_scale(d.t_min_pfm_mem))
        .attr("height", layout.barWidth)
        .attr(
          "width",
          (d, i) => mem_scale(d.t_max_pfm_mem) - mem_scale(d.t_min_pfm_mem)
        )
        // .attr("stroke", "black")
        .attr("fill", "#222");

      // 绘制timeconsume表现箱型图
      const g2 = svg
        .append("g")
        .attr("transform", (d) => `translate(${layout.Height}, ${15})`)
        .selectAll("line")
        .data(this.dataobj.titles)
        .enter()
      g2.append("line")
        .attr("x1", 0)
        .attr("y1", (d, i) => i * layout.Height + layout.Height / 2 )
        .attr("x2", layout.LineLen)
        .attr("y2", (d, i) => i * layout.Height + layout.Height / 2)
        .style("stroke", "grey")
        .style("stroke-width", 0.5);
      g2.append("line")
        .attr("x1", (d, i) => tc_scale(d.t_mean_pfm_tc))
        .attr("y1", (d, i) => i * layout.Height + layout.Height / 2 - layout.barWidth )
        .attr("x2", (d, i) => tc_scale(d.t_mean_pfm_tc))
        .attr("y2", (d, i) => i * layout.Height + layout.Height / 2 + layout.barWidth)
        .style("stroke", "red")
        .style("stroke-width", 1);
      g2.append("rect")
        .attr(
          "y",
          (d, i) => i * layout.Height + layout.Height / 2 - layout.barWidth / 2
        )
        .attr("x", (d, i) => tc_scale(d.t_min_pfm_tc))
        .attr("height", layout.barWidth)
        .attr(
          "width",
          (d, i) => tc_scale(d.t_max_pfm_tc) - tc_scale(d.t_min_pfm_tc)
        )
        // .attr("stroke", "black")
        .attr("fill", "#222");
    },
    drawScore(svg, layout) {
      const size_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, layout.LineLen]);
      const color = d3.schemeAccent;
      const data = this.dataobj.titles;
      data.forEach((obj,index) => {
        const arr = obj.t_score_distribute.b;
        const bars = svg.append('g').attr('name',"bars")
          .attr("transform", (d,i) => `translate(${layout.Height}, ${index * layout.Height + layout.Height/2 - 20})`)
        let base = 0
        arr.forEach((item, i) => {
          bars.append('rect')
            .attr('x', (d,i) => {
              const res = size_scale(base)
              base += item
              return res
            })
            .attr('y', 0)
            .attr('width', (d, i) => size_scale(item))
            .attr('height', layout.barWidth)
            .attr('fill', color[i])
        })
      });
      // const g = svg
      //   .append("g").attr("name","bars")
      //   .attr("transform", (d) => `translate(${layout.Height}, -25)`)
      //   .selectAll("g")
      //   .data(this.dataobj.titles)
      //   .enter()
      // let base = 0
      // g.append('g')
      //   .selectAll('rect')
      //   .data(d => d.t_score_distribute.b)
      //   .enter()
      //   .append('rect')
      //   .attr('x', (d,i) => {
      //     base += d
      //     return size_scale(base)
      //   })
      //   .attr('y', (d, i) => i * layout.Height + layout.Height / 2 + i*layout.barWidth)
      //   .attr('width', (d, i) => size_scale(d))
      //   .attr('height', layout.barWidth - 1)
      //   .attr('fill', (d,i) => color[i])
      
    }
  },
};
</script>
<style scoped>
.TitlesContainer {
  width: 50%;
  height: 100%;
  background-color: rgb(247, 202, 202);
}
</style>
