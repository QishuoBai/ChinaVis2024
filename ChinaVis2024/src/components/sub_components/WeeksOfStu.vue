<template>
  <div>
    <div ref="Title_Container" class="ml-3 position-sticky top-0"></div>
    <div class="d-flex flex-row">
      <div class="position-sticky left-0 bg-grey-lighten-2">
        <v-icon class="ma-2" icon="mdi-account"></v-icon>
      </div>
      <div ref="Rose_container"></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { knowledgeOrder, colorOfRose, WeekTable } from "@/utils/asset";
export default {
  data() {
    return {
      layout: {
        HEIGHT: 100,
        WeeksNum: 20,
      },
    };
  },
  mounted() {
    this.draw_Stu();
  },
  props: {
    id: String,
    dataobj: Object,
  },
  methods: {
    draw_Stu() {
      const svg = d3
        .select(this.$refs.Rose_container)
        .append("svg")
        .attr("viewBox", [
          0,
          0,
          this.layout.HEIGHT * this.layout.WeeksNum,
          this.layout.HEIGHT,
        ])
        .attr("width", this.layout.HEIGHT * this.layout.WeeksNum)
        .attr("height", this.layout.HEIGHT);
      // .attr('style', 'max-width: 100%; height: auto;');

      const RADIUS = this.layout.HEIGHT / 2;
      const R_Scale = d3.scaleLinear().domain([0, 1]).range([0, RADIUS]);
      const arc = d3
        .arc()
        .startAngle((d, i) => knowledgeOrder.Radian[i].sa)
        .endAngle((d, i) => knowledgeOrder.Radian[i].ea)
        // .padAngle(0.05)
        .innerRadius(0)
        .outerRadius((d) => R_Scale(d));

      // 依次绘制每朵玫瑰
      this.dataobj.roseArr.forEach((obj, index) => {
        const rose_group = svg.append("g").attr("class", "roseGroup");
        if (index % 2 == 0) {
          rose_group
            .append("rect")
            .attr("x", index * this.layout.HEIGHT)
            .attr("y", 0)
            .attr("width", this.layout.HEIGHT)
            .attr("height", this.layout.HEIGHT)
            .style("fill", "#eee");
        }
        rose_group
          .append("g")
          .attr("class", "rose")
          .attr(
            "transform",
            () =>
              `translate(${
                index * this.layout.HEIGHT + this.layout.HEIGHT / 2
              }, ${this.layout.HEIGHT / 2})`
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
