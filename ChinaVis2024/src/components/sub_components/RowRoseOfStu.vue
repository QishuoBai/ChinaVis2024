<template>
  <!-- <p class="ma-1">{{ dataobj.student_ID }}</p> -->
  <div
    :style="{ height: `${height}px` }"
    :id="'Stu' + dataobj.student_ID"
  ></div>
</template>
<script>
import * as d3 from "d3";
import { knowledgeOrder, colorOfRose } from "@/utils/asset";
import { clusterStore } from "@/store";
import {adjustHexOpacity} from '@/utils/tool.js'
export default {
  data() {
    return {
      Width: 0,
      Height: 50,
      RoseNum: 22,
      R_rose: 35,
      inner_radius: 15,
      mini_radius: 7,
    };
  },
  computed: {
    cluster_result() {
      return clusterStore().result;
    },
  },
  props: {
    dataobj: Object,
    height: Number,
    gray_color: String,
  },
  mounted() {
    this.$nextTick(() => {
      this.draw();
    });
  },
  methods: {
    draw() {
      const Sid = this.dataobj.student_ID;
      this.Height = d3.select("#Stu" + Sid).node().clientHeight;
      this.Width = this.Height * this.RoseNum;
      d3.select("#Stu" + Sid).html("");
      const svg = d3
        .select("#Stu" + Sid)
        .append("svg")
        .attr("width", this.Width)
        .attr("height", this.Height)
        .attr("viewBox", [0, 0, this.Width, this.Height])
        .attr("overflow", "visible");
      this.drawRose(svg, this.dataobj);
    },
    drawRose(svg, data) {
      const R_Scale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([this.inner_radius, this.R_rose]);
      const opacityScale = d3.scaleLinear().domain([0, 1]).range([0, 1]);
      const progressScale = d3
        .scaleLinear()
        .domain([0, 0.5])
        .range([1, this.mini_radius * 2.5]);
      const student_id = data.student_ID;
      const cluster = this.cluster_result.find(
        (item) => item.student_ID === student_id
      ).cluster;
      const arc = d3
        .arc()
        .startAngle((d, i) => knowledgeOrder.Radian[i].sa)
        .endAngle((d, i) => knowledgeOrder.Radian[i].ea)
        .padAngle(0.02)
        .innerRadius(this.inner_radius)
        .outerRadius((d) => R_Scale(d));

      const g = svg.append("g").attr("name", "RosesGroup");
      //   画背景和进步线
      data.roseArr.forEach((obj, index) => {
        const rect_group = g.append("g").attr("class", "bgrect");
        if (index % 2 == 0) {
          rect_group
            .append("rect")
            .attr("x", index * this.Height)
            .attr("y", 0)
            .attr("width", this.Height)
            .attr("height", this.Height)
            .style("fill", this.gray_color);
        }
        if (index > 0) {
          g.append("line")
            .attr("x1", (index - 0.5) * this.Height)
            .attr("x2", (index + 0.5) * this.Height)
            .attr("y1", this.Height / 2)
            .attr("y2", this.Height / 2)
            .attr("stroke", adjustHexOpacity(clusterStore().colors[cluster], 0.3))
            .attr("stroke-width", Math.min(progressScale(obj.progress),this.inner_radius));
        }
      });
      //   画内容
      data.roseArr.forEach((obj, index) => {
        // 背景白圆
        g.append("g")
          .append("circle")
          .attr("cx", (index + 0.5) * this.Height)
          .attr("cy", this.Height / 2)
          .attr("r", this.inner_radius)
          .attr("fill", "white");
        //   总分圆
        g.append("g")
          .append("circle")
          .attr("cx", (index + 0.5) * this.Height)
          .attr("cy", this.Height / 2)
          .attr("r", this.mini_radius)
          .attr("fill", clusterStore().colors[cluster])
          .attr("stroke", "lightgray")
          .attr("stroke-width", "1px")
          .attr("fill-opacity", opacityScale(obj.total))
          .attr("stroke-dasharray", "2,2");
        const rose_group = g.append("g").attr("class", "rose");
        // rose
        rose_group
          .attr(
            "transform",
            () =>
              `translate(${index * this.Height + this.Height / 2}, ${
                this.Height / 2
              })`
          )
          .selectAll("path")
          .data(obj.rose)
          .enter()
          .append("path")
          .attr("d", arc)
          .attr("fill", adjustHexOpacity(clusterStore().colors[cluster], 0.8));
      });
    },
  },
};
</script>
