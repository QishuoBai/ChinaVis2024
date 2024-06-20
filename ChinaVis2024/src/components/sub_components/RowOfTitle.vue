<template>
  <p class="ma-1">{{ dataobj.t_id }}</p>
  <div style="height: 100px" :id="'Title' + dataobj.t_id"></div>
</template>
<script>
import * as d3 from "d3";
import { colorOfStack } from "@/utils/asset";
export default {
  data() {
    return {
      Width: 0,
      Height: 50,
      RO: 30,
      RI: 15,
      LineLen: 200,
      barWidth: 20,
      h_LENGTH: 300,
      h_HEIGHT: 50,
    };
  },
  props: {
    dataobj: Object,
  },
  mounted() {
    const Tid = this.dataobj.t_id;
    this.Width = d3.select("#Title" + Tid).node().clientWidth;
    this.Height = d3.select("#Title" + Tid).node().clientHeight;

    const svg = d3
      .select("#Title" + Tid)
      .append("svg")
      .attr("width", this.Width)
      .attr("height", this.Height)
      .attr("viewBox", [0, 0, this.Width, this.Height]);
    this.drawCircle(svg, this.dataobj);
    this.drawScore(svg, this.dataobj.t_score_distribute);
    this.drawSubmit(svg, this.dataobj);
  },
  methods: {
    drawCircle(svg, data) {
      const R_OutScale = d3
        .scaleLinear()
        .domain([0, 10])
        .range([this.RI, this.RO]);
      const R_InScale = d3
        .scaleLinear()
        .domain([10, 50])
        .range([this.RI / 3, this.RI]);
      const circles = svg.append("g");
      circles
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", this.Height / 2)
        .attr("cy", this.Height / 2)
        .attr("r", R_OutScale(data.t_mean_sbmnum))
        .attr("fill", "red");
      circles
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", this.Height / 2)
        .attr("cy", this.Height / 2)
        .attr("r", R_InScale(data.t_mean_score))
        .attr("fill", "red");
    },
    drawScore(svg, data) {
      const size_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, this.LineLen]);
      const color = d3.schemeAccent;
      const arr = data.b;
      let base = 0;
      const g = svg
        .append("g")
        .attr("name", "bars")
        .attr("transform", (d, i) => `translate(${this.Height}, ${70})`);
      data.b.forEach((item, i) => {
        g.append("rect")
          .attr("x", () => {
            const res = size_scale(base);
            base += item;
            return res;
          })
          .attr("y", 0)
          .attr("width", (d, i) => size_scale(item))
          .attr("height", this.barWidth)
          .attr("fill", colorOfStack[i])
          .attr("score", data.a[i])
        g.append('text')
          .text(i)
          .attr("x", () => size_scale(base))
          .attr("y", this.barWidth)
          .attr("fill", "black")
          .attr("font-size", 15)
          .attr("font-weight", "bold")
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "end")
      }
    );
    },
    drawSubmit(svg, data) {
      // const arr = [];
      // data.SubmitArr.forEach((element) => {
      //   return arr.push(new Date(element * 1000).toLocaleString());
      // });
      const bins = d3
        .bin()
        .thresholds(40)
        .value((d) => d)(data.SubmitArr);
      //   console.log(bins);

      const x = d3
        .scaleLinear()
        // .domain([bins[0].x0, bins[bins.length - 1].x1])
        .domain([1693471583.0, 1706158726.0])
        .range([0, this.h_LENGTH]);
      // const x2 = d3
      //   .scaleTime()
      //   .domain(d3.extent(arr, (d) => d))
      //   .range([0, this.h_LENGTH]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([this.h_HEIGHT, 0]);
      const g = svg.append("g").attr("transform", `translate(${350}, ${0})`);
      g.attr("fill", "steelblue")
        .selectAll()
        .data(bins)
        .join("rect")
        .attr("x", (d) => x(d.x0) + 1)
        .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
        .attr("y", (d) => y(d.length))
        .attr("height", (d) => y(0) - y(d.length));

      g.append("g")
        .attr("transform", `translate(${0}, ${this.h_HEIGHT})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(this.h_LENGTH / 80)
            .tickSizeOuter(0)
            .tickFormat((d) => new Date(d * 1000).toLocaleString())
        )
        .call((g) =>
          g
            .append("text")
            .attr("x", 0)
            .attr("y", 30)
            .attr("fill", "black")
            .attr("text-anchor", "start")
            .text("Submit Time Line →")
        );
    },
  },
};
</script>
