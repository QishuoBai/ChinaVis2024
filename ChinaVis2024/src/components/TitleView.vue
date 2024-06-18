<template>
  <div class="h-100 w-100">
    <div class="text-h6">Title View</div>
    <!-- <a-dropdown>
        <a class="ant-dropdown-link" @click.prevent>
            select knowledge
            <DownOutlined />
        </a>
        <template #overlay>
        <a-menu>
            <a-menu-item>
            <a href="javascript:;">1st menu item</a>
            </a-menu-item>
            <a-menu-item>
            <a href="javascript:;">2nd menu item</a>
            </a-menu-item>
            <a-menu-item>
            <a href="javascript:;">3rd menu item</a>
            </a-menu-item>
        </a-menu>
        </template>
    </a-dropdown> -->
    <div style="width: 100%; height: 60%; display: flex">
      <div class="TitlesContainer"></div>
      <div class="TitlePerformance"></div>
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import { DownOutlined } from "@ant-design/icons-vue";
export default {
  data() {
    return {
      Tit_IDs: [],
      dataobj: {
        knowledge: "b3C9s",
        sub_knowledges: ["b3C9s_j0v1yls8", "b3C9s_l4z6od7y"],
        titleNum: 3,
        titles: [
          {
            t_id: "Question_bumGRTJ0c8p4v5D6eHZa",
            belong: "b3C9s_l4z6od7y",
            t_mean_sbmnum: 0.5,
            t_mean_score: 0.1,
          },
          {
            t_id: "Question_hZ5wXofebmTlzKB1jNcP",
            belong: "b3C9s_l4z6od7y",
            t_mean_sbmnum: 0.3,
            t_mean_score: 0.3,
          },
          {
            t_id: "Question_FNg8X9v5zcbB1tQrxHR3",
            belong: "b3C9s_j0v1yls8",
            t_mean_sbmnum: 0.8,
            t_mean_score: 0.6,
          },
        ],
      },
    };
  },
  mounted() {
    this.drawTitles();
  },
  methods: {
    drawTitles() {
      const HEIGHT = d3.select(".TitlesContainer").node().clientHeight;
      const WIDTH = d3.select(".TitlesContainer").node().clientWidth;
      const RO = 30,
        RI = 15,
        Interval = 60;

      const svg = d3
        .select(".TitlesContainer")
        .append("svg")
        .attr("viewBox", [0, 0, WIDTH, HEIGHT])
        .attr("width", WIDTH)
        .attr("height", HEIGHT);
      const R_OutScale = d3.scaleLinear().domain([0, 1]).range([RI, RO]);
      const R_InScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([RI / 3, RI]);
      const IndexOfSub = (belong) =>
        this.dataobj.sub_knowledges.indexOf(belong);

      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", WIDTH / 2)
        .attr("cy", (d, i) => (i + 1) * Interval)
        .attr("r", (d) => R_OutScale(d.t_mean_sbmnum))
        .attr("fill", "red");
      svg
        .append("g")
        .selectAll("circle")
        .data(this.dataobj.titles)
        .enter()
        .append("circle")
        .attr("opacity", 0.5)
        .attr("cx", WIDTH / 2)
        .attr("cy", (d, i) => (i + 1) * Interval)
        .attr("r", (d) => R_InScale(d.t_mean_score))
        .attr("fill", "red");
    },
  },
};
</script>
<style scoped>
.TitlesContainer {
  width: 10%;
  height: 100%;
  background-color: bisque;
}
.TitlePerformance {
  width: 90%;
  height: 100%;
  background-color: aquamarine;
}
</style>
