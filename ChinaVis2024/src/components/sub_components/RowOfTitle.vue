<template>
  <!-- <p class="ma-1">{{ dataobj.title_ID }}</p> -->
  <div style="height: 100px" :id="'Title' + dataobj.title_ID"></div>
</template>
<script>
import * as d3 from "d3";
import { colorOfStack } from "@/utils/asset";
import { clusterStore } from "@/store";
export default {
  data() {
    return {
      Tid: "",
      Width: 0,
      Height: 50,
      RO: 30,
      RI: 15,
      LineLen: 200,
      barWidth: 20,
      h_LENGTH: 300,
      h_HEIGHT: 50,
      bandWidth: 200,
      bandHeight: 8,
      Num_segment: 10,
    };
  },
  props: {
    dataobj: Object,
  },
  mounted() {
    this.Tid = this.dataobj.title_ID;
    this.Width = d3.select("#Title" + this.Tid).node().clientWidth;
    this.Height = d3.select("#Title" + this.Tid).node().clientHeight;
    const svg = d3
      .select("#Title" + this.Tid)
      .append("svg")
      .attr("width", this.Width)
      .attr("height", this.Height)
      .attr("viewBox", [0, 0, this.Width, this.Height]);
    this.drawCircle(svg, this.dataobj);
    this.drawScore(svg, this.dataobj);
    this.drawSubmit(svg, this.dataobj);

    // this.drawMem(svg, this.dataobj);
    this.drawSubNum(svg, this.dataobj);
    const scaleL = d3.scaleLog().domain([1, 66000]).range([1, 10]).base(2);
  },
  methods: {
    drawCircle(svg, data) {
      const circles = svg.append("g").attr("name", "title circles");
      const R_OutScale = d3
        .scaleLinear()
        .domain([0, 10])
        .range([this.RI, this.RO]);
      const R_InScale = d3
        .scaleLinear()
        .domain([10, 50])
        .range([this.RI / 3, this.RI]);
      const handleMouseOverCircle = (e) => {
        // console.log(e.target.getAttribute("tid"), data.title_ID);
        clusterStore().hoverTitleInfo = {
          show: true,
          title: data.title_ID,
          score: `${((data.t_Fullscore * data.t_mean_score) / 100).toFixed(
            2
          )}/${data.t_Fullscore}`,
          // score: (data.t_Fullscore*data.t_mean_score/100).toFixed(2),
          sbmnum: data.t_mean_sbmnum.toFixed(2),
        };
        d3.select("#TitleTooltip")
          .style("left", e.clientX + 20 + "px")
          .style("top", e.clientY + "px");
      };
      circles
        .append("circle")
        .attr("class", "Titlecircle")
        .attr("tid", this.Tid)
        .attr("opacity", 0.5)
        .attr("cx", this.Height / 2)
        .attr("cy", this.Height / 2)
        .attr("r", R_OutScale(data.t_mean_sbmnum))
        .attr("fill", "red")
        .attr("cursor", "pointer")
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", () => {
          clusterStore().hoverTitleInfo.show = false;
        });
      circles
        .append("circle")
        .attr("class", "Titlecircle")
        .attr("opacity", 0.5)
        .attr("cx", this.Height / 2)
        .attr("cy", this.Height / 2)
        .attr("r", R_InScale(data.t_mean_score))
        .attr("fill", "red")
        .attr("cursor", "pointer")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 5)
        .attr("y", 5)
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", () => {
          clusterStore().hoverTitleInfo.show = false;
        });
    },
    drawScore(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "score_distribute_bars")
        .attr("transform", `translate(${this.Height}, ${70})`);
      const size_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, this.LineLen]);
      const color = d3.scaleOrdinal(d3.schemeAccent);
      const sdObj = data.t_score_distribute;
      const SubNum = 1364;
      let base = 0;
      Object.keys(sdObj).forEach((key) => {
        g.append("rect")
          .attr("x", size_scale(base))
          .attr("y", 0)
          .attr("width", size_scale(sdObj[key] / SubNum))
          .attr("height", this.barWidth)
          .attr("fill", color(key))
          .attr("score", key);
        g.append("text")
          .text(key)
          .attr("x", () => size_scale(base))
          .attr("y", this.barWidth)
          .attr("fill", "black")
          .attr("font-size", 15)
          .attr("font-weight", "bold")
          .attr("font-family", "sans-serif")
          .attr("text-anchor", "start");
        base += sdObj[key] / SubNum;
      });
    },
    drawSubmit(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "Submits Time Line")
        .attr("transform", `translate(${350}, ${10})`);
      const bins = d3
        .bin()
        .thresholds(40)
        .value((d) => d)(data.t_SubmitArr);
      const x = d3
        .scaleLinear()
        .domain([1693471583.0, 1706158726.0]) //时间最大最小
        .range([0, this.h_LENGTH]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([this.h_HEIGHT, 0]);
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
            .tickFormat((d) => new Date(d * 1000).toLocaleString()) //修改标签为正常时间格式
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
    drawMem(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "Mem points")
        .attr("transform", `translate(${this.Height}, ${20})`);

      const block = d3
        .scaleQuantize()
        .domain([0, 65536])
        .range([0, 1, 2, 3, 4, 5]);
      const scaleL = d3.scaleLog().domain([1, 100000]).range([1, 5]);

      const segment = (mem) => {
        if (mem <= 200) {
          return 0;
        } else if (mem <= 300) {
          return 1;
        } else if (mem <= 350) {
          return 2;
        } else if (mem <= 400) {
          return 3;
        } else if (mem <= 450) {
          return 4;
        } else if (mem <= 600) {
          return 5;
        } else if (mem <= 1000) {
          return 6;
        } else if (mem <= 70000) {
          return 7;
        }
      };
      g.selectAll()
        .data(data.t_memArr)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          const index = Math.floor(segment(d));
          const delt = Math.random() * (this.bandWidth / 8);
          return index * (this.bandWidth / 8) + delt;
        })
        .attr("cy", () => (Math.random() * 2 - 1) * this.bandHeight)
        .attr("r", 1)
        .style("fill", "blue")
        .style("opacity", 0.2);
    },
    drawTc(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "Tc points")
        .attr("transform", `translate(${this.Height}, ${40})`);
      g.append("text")
        .attr("x", -20)
        .attr("y", 5)
        .attr("fill", "black")
        .attr("font-size", 15)
        .text("TC");

      const block = d3
        .scaleQuantize()
        .domain([0, 40])
        .range([0, 1, 2, 3, 4, 5, 6, 7]);

      g.selectAll()
        .data(data.t_tcArr)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          const index = Math.floor(block(d));
          const delt = Math.random() * (this.bandWidth / 8);
          return index * (this.bandWidth / 8) + delt;
        })
        .attr("cy", () => (Math.random() * 2 - 1) * this.bandHeight)
        .attr("r", 1)
        .style("fill", "blue")
        .style("opacity", 0.2);
    },
    drawSubNum(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "SubNum points")
        .attr("transform", `translate(${this.Height}, ${30})`);

      const block = d3
        .scaleQuantize()
        .domain([0, 152])
        .range(d3.range(0, this.Num_segment + 1));
      const yScale = d3
        .scaleLinear()
        .domain([0, 4])
        .range([0, this.bandHeight * 5]);

      g.selectAll()
        .data(data.t_s_Submit)
        .enter()
        .append("circle")
        .attr("cx", (d) => {
          const index = Math.floor(block(d.SubNum));
          const delt = Math.random() * (this.bandWidth / this.Num_segment);
          return index * (this.bandWidth / this.Num_segment) + delt;
        })
        .attr("cy", (d) => yScale(d.Maxscore))
        .attr("r", 2)
        .style("fill", "blue")
        .style("opacity", 0.8);
    },
  },
};
</script>
