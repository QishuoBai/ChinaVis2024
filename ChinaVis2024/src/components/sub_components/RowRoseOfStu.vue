<template>
  <!-- <p class="ma-1">{{ dataobj.student_ID }}</p> -->
  <div style="height: 100px" :id="'Stu' + dataobj.student_ID"></div>
</template>
<script>
import * as d3 from "d3";
import { knowledgeOrder, colorOfRose, WeekTable } from "@/utils/asset";
export default {
  data() {
    return {
      Width: 0,
      Height: 50,
      RoseNum: 22,
      R_rose: 25,
    };
  },
  props: {
    dataobj: Object,
  },
  mounted() {
    const Sid = this.dataobj.student_ID;
    this.Height = d3.select("#Stu" + Sid).node().clientHeight;
    this.Width = this.Height * this.RoseNum;
    const svg = d3
      .select("#Stu" + Sid)
      .append("svg")
      .attr("width", this.Width)
      .attr("height", this.Height)
      .attr("viewBox", [0, 0, this.Width, this.Height]);

    this.drawRose(svg, this.dataobj);
  },
  methods: {
    drawRose(svg, data) {
      const R_Scale = d3.scaleLinear().domain([0, 1]).range([0, this.R_rose]);
      const arc = d3
        .arc()
        .startAngle((d, i) => knowledgeOrder.Radian[i].sa)
        .endAngle((d, i) => knowledgeOrder.Radian[i].ea)
        // .padAngle(0.05)
        .innerRadius(0)
        .outerRadius((d) => R_Scale(d));

      const g = svg.append("g").attr("name", "RosesGroup");
      data.roseArr.forEach((obj, index) => {
        const rect_group = g.append("g").attr("class", "bgrect")
        if (index % 2 == 0) {
          rect_group
            .append("rect")
            .attr("x", index * this.Height)
            .attr("y", 0)
            .attr("width", this.Height)
            .attr("height", this.Height)
            .style("fill", "#eee");
        }
        const rose_group = g.append("g").attr("class", "rose");
        rose_group
          .attr(
            "transform", () =>`translate(${index * this.Height + this.Height / 2}, ${this.Height / 2})`
          )
          .selectAll("path")
          .data(obj.rose)
          .enter()
          .append("path")
          .attr("d", arc)
          .attr("fill", (d, i) => colorOfRose(i))
          .attr("opacity", 0.8);
        
      });
    },
  },
};
</script>
