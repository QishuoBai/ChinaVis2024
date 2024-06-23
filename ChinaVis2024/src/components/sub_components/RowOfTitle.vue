<template>
  <!-- <p class="ma-1">{{ dataobj.title_ID }}</p> -->
  <div style="height: 150px" :id="'Title' + dataobj.title_ID"></div>
</template>
<script>
import * as d3 from "d3";
import { colorOfStack } from "@/utils/asset";
import { clusterStore } from "@/store";
export default {
  data() {
    return {
      Tid: "",
      Difficulty: 0,
      RO: 30, // circle外半径
      RI: 15, // circle内半径
      Width: 0,
      Height: 0,
      MarginLeft: 30,
      MarginBottom: 30,
      MarginTop: 40,
      ScoreBarLength: 300,
      ScoreBarHeight: 20,
      AreaLength: 300,
      AreaHeight: 50,
      bandLength: 200,
      bandHeight: 8,
      bandSegNum: 10,
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
    this.drawSubmit(svg, this.dataobj);
    this.drawScore(svg, this.dataobj);
    // this.drawSubNum(svg, this.dataobj);
  },
  methods: {
    drawScore(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "score_distribute_bars")
        .attr("transform", `translate(${this.MarginLeft}, ${this.Height - this.MarginBottom})`);
      const size_scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([0, this.ScoreBarLength]);
      const color = d3.scaleOrdinal(d3.schemeAccent);
      const sdObj = data.t_score_distribute;
      const SubNum = 1364;
      let base = 0;
      Object.keys(sdObj).forEach((key) => {
        g.append("rect")
          .attr("x", size_scale(base))
          .attr("y", 0)
          .attr("width", size_scale(sdObj[key] / SubNum))
          .attr("height", this.ScoreBarHeight)
          .attr("fill", color(key))
          .attr("score", key);
        g.append("text")
          .text(key)
          .attr("x", () => size_scale(base))
          .attr("y", this.ScoreBarHeight)
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
        .attr("name", "Submits Time and Circle")
        .attr("transform", `translate(${this.MarginLeft}, ${this.MarginTop})`);
      const xScale = d3
        .scaleLinear()
        .domain([1693471583.0, 1706158726.0]) //时间最大最小
        .range([0, this.AreaLength]);
      const bins = d3.bin().domain(xScale.domain()).thresholds(40)(
        data.t_SubmitArr
      );
      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(bins, (d) => d.length)])
        .range([this.AreaHeight, 0]);
      const area = d3
        .area()
        .x((d) => xScale(d.x0))
        .y0(this.AreaHeight)
        .y1((d) => yScale(d.length))
        .curve(d3.curveCatmullRom.alpha(0.5));
      const R_OutScale = d3
        .scaleLinear()
        .domain([0, 10])
        .range([this.RI, this.RO]);
      const R_InScale = d3.scaleLinear().domain([0, 50]).range([0, this.RI]);
      // 计算本题的难易度
      // this.Difficulty =
      //   this.RI + R_OutScale(data.t_mean_sbmnum) - R_InScale(data.t_mean_score);
      this.Difficulty = data.t_mean_sbmnum - data.t_mean_score;
      const heightScale = d3
        .scaleLinear()
        .domain([-50, -5])
        .range([this.AreaHeight, 0]);
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
          difficulty: this.Difficulty.toFixed(2),
        };
        d3.select("#TitleTooltip")
          .style("left", e.clientX + 5 + "px")
          .style("top", e.clientY + 5 + "px");
      };

      // 绘制区域
      g.append("path").datum(bins).attr("d", area).attr("fill", "#ddd");
      // 绘制太阳
      g.append("circle")
        .attr("class", "Titlecircle")
        .attr("tid", this.Tid)
        .attr("opacity", 0.5)
        .attr("cx", xScale(data.t_SubmitMeanTime))
        .attr("cy", heightScale(this.Difficulty))
        .attr("r", R_OutScale(data.t_mean_sbmnum))
        .attr("fill", "red")
        .attr("cursor", "pointer")
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", () => {
          clusterStore().hoverTitleInfo.show = false;
        });
      g.append("circle")
        .attr("class", "Titlecircle")
        .attr("opacity", 0.5)
        .attr("cx", xScale(data.t_SubmitMeanTime))
        .attr("cy", heightScale(this.Difficulty))
        .attr("r", R_InScale(data.t_mean_score))
        .attr("fill", "red")
        .attr("cursor", "pointer")
        // .attr("width", 100)
        // .attr("height", 50)
        // .attr("x", 5)
        // .attr("y", 5)
        .on("mouseover", handleMouseOverCircle)
        .on("mouseout", () => {
          clusterStore().hoverTitleInfo.show = false;
        });
      // d3绘制竖线
      g.append("line")
        .attr("x1", xScale(data.t_SubmitMeanTime))
        .attr("y1", heightScale(this.Difficulty))
        .attr("x2", xScale(data.t_SubmitMeanTime))
        .attr("y2", this.AreaHeight)
        .attr("stroke", "black");
      // 绘制轴
      g.append("g")
        .attr("transform", `translate(${0}, ${this.AreaHeight})`)
        .call(
          d3
            .axisBottom(xScale)
            .ticks(this.AreaLength / 80)
            .tickSizeOuter(0)
            .tickFormat((d) => new Date(d * 1000).toLocaleString()) //修改标签为正常时间格式
        );
      // .call((g) =>
      //   g
      //     .append("text")
      //     .attr("x", 0)
      //     .attr("y", 30)
      //     .attr("fill", "black")
      //     .attr("text-anchor", "start")
      //     .text("Submit Time Line →")
      // );
    },
    drawSubNum(svg, data) {
      const g = svg
        .append("g")
        .attr("name", "SubNum points")
        .attr("transform", `translate(${this.Height}, ${30})`);

      const block = d3
        .scaleQuantize()
        .domain([0, 152])
        .range(d3.range(0, this.bandSegNum + 1));
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
          const delt = Math.random() * (this.bandLength / this.bandSegNum);
          return index * (this.bandLength / this.bandSegNum) + delt;
        })
        .attr("cy", (d) => yScale(d.Maxscore))
        .attr("r", 2)
        .style("fill", "blue")
        .style("opacity", 0.8);
    },
  },
};
</script>
