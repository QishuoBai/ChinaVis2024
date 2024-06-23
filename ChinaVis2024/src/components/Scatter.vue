<template>
  <div class="h-100 w-100 pa-2 d-flex flex-column">
    <div
      class="text-body-1 font-weight-bold d-flex flex-row justify-space-between"
    >
      <div>Scatter View</div>
      <div>
        <v-dialog v-model="search_dialog" max-width="600">
          <template v-slot:activator="{ props: activatorProps }">
            <v-icon
              icon="mdi-magnify"
              size="small"
              v-bind="activatorProps"
            ></v-icon>
          </template>

          <v-card>
            <v-card-title class="text-body-1">
              <v-icon icon="mdi-magnify" size="small"></v-icon>
              Search Student
            </v-card-title>
            <v-card-text>
              <v-autocomplete
                v-model="search_reault"
                label="Student ID"
                :items="cluster_result.map((d) => d.student_ID)"
                variant="outlined"
              ></v-autocomplete
            ></v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Confirm"
                variant="text"
                @click="confirmSearch()"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-icon
          @click="changeModel_Brush()"
          icon="mdi-brush-variant"
          size="small"
          class="mx-2"
        ></v-icon>
        <v-icon
          @click="clearSelectedID()"
          icon="mdi-delete-outline"
          size="small"
        ></v-icon>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="flex-grow-1 d-flex flex-column align-center px-2">
      <div class="d-flex flex-row align-center justify-center my-2">
        <v-btn
          v-for="index in cluster_num"
          :key="index"
          :variant="
            selected.cluster == index || selected.cluster == 0
              ? 'outlined'
              : 'text'
          "
          size="small"
          class="text-body-2 font-weight-regular mx-2"
          @click="clickCluster(index)"
        >
          <template v-slot:prepend>
            <div
              :style="{
                backgroundColor: cluster_color[index - 1],
                height: '10px',
                width: '10px',
              }"
              class="rounded-circle"
            ></div>
          </template>
          Cluster{{ index }}</v-btn
        >
      </div>
      <div ref="svg_container" class="w-100 flex-grow-1 border rounded elevation-2"></div>
    </div>
    <div
      v-if="tooltip.show"
      id="scatter-view-tooltip"
      class="rounded-pill bg-grey-lighten-2 text-body-2 d-flex flex-row align-center justify-center pa-2"
      style="position: absolute; height: 30px"
    >
      {{ tooltip.text }}
    </div>
  </div>
</template>

<script>
import stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { clusterStore } from "@/store";

export default {
  data() {
    return {
      cluster_num: 3,
      selected: {
        cluster: -1, // 0 标识全选
        stu_IDs: [],
      },
      search_dialog: false,
      search_reault: null,
      xScale: null,
      yScale: null,
      brush_mode: false,
      brush: null,
      brush_students: [],
      tooltip:{
        show:false,
        text: null
      }
    };
  },
  computed: {
    cluster_result() {
      return clusterStore().result;
    },
    cluster_color() {
      return clusterStore().colors;
    },
    store_selected_students() {
      return clusterStore().selected_students;
    },
  },
  watch: {
    cluster_result() {
      this.draw_scatter();
    },
    store_selected_students() {
      this.selected.stu_IDs = clusterStore().selected_students;
      this.hightlightSelected();
    },
  },
  mounted() {},
  methods: {
    draw_scatter() {
      const svg_height = this.$refs.svg_container.clientHeight-4;
      const svg_width = this.$refs.svg_container.clientWidth;
      const cluster_color = this.cluster_color;
      const data = this.cluster_result;
      d3.select(this.$refs.svg_container).html("");
      const svg = d3
        .select(this.$refs.svg_container)
        .append("svg")
        .attr("viewBox", `0 0 ${svg_width} ${svg_height}`)
        .attr("width", svg_width)
        .attr("height", svg_height);
      const padding = 10;
      this.xScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.x), d3.max(data, (d) => d.x)])
        .range([padding, svg_width - padding]);
      this.yScale = d3
        .scaleLinear()
        .domain([d3.min(data, (d) => d.y), d3.max(data, (d) => d.y)])
        .range([padding, svg_height - padding]);
      // 画散点
      svg
        .append("g")
        .attr("class", "g-scatter")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "scatter")
        .attr("cx", (d) => this.xScale(d.x))
        .attr("cy", (d) => this.yScale(d.y))
        .attr("r", 4)
        .attr("fill", (d) => cluster_color[d.cluster])
        // .attr("cursor", "pointer")
        .style("fill-opacity", 0.6)
        .attr("stroke", "none")
        .attr("cursor", "pointer")
        .on("click", this.EventClick)
        .on("mouseover", (e, d) => {
            if(this.brush_mode) return;
            this.tooltip.text = d.student_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#scatter-view-tooltip")
                .style("left", e.clientX + 20 + "px")
                .style("top", e.clientY + "px");
            });
          })
          .on("mouseout", () => {
            if(this.brush_mode) return;
            this.tooltip.show = false;
          });
      // 画有stoke的散点，以保证高亮时的部分点不被遮挡
      svg
        .append("g")
        .attr("class", "g-stroke-scatter")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "stroke-scatter")
        .attr("cx", (d) => this.xScale(d.x))
        .attr("cy", (d) => this.yScale(d.y))
        .attr("r", 4)
        .attr("fill", (d) => cluster_color[d.cluster])
        .style("fill-opacity", 0.6)
        .attr("stroke", "black")
        .attr("visibility", (d) =>
          this.selected.stu_IDs.includes(d.student_ID) ? "visible" : "hidden"
        )
        .attr("cursor", "pointer")
        .on("click", this.EventClick)
        .on("mouseover", (e, d) => {
            if(this.brush_mode) return;
            this.tooltip.text = d.student_ID;
            this.tooltip.show = true;
            this.$nextTick(() => {
              d3.select("#scatter-view-tooltip")
                .style("left", e.clientX + 20 + "px")
                .style("top", e.clientY + "px");
            });
          })
          .on("mouseout", () => {
            if(this.brush_mode) return;
            this.tooltip.show = false;
          });;
        this.brush = d3.brush()
            .on("brush", this.EventBrushing)
            .on("end", this.EventBrushEnd);
        
    },
    clickCluster(index) {
        return;
      this.selected.cluster = this.selected.cluster == index ? 0 : index;
      clusterStore().selected_cluster = this.selected.cluster;
    },
    clearSelectedID() {
      this.selected.stu_IDs = [];
      this.hightlightSelected();
      clusterStore().selected_students = [];
    },
    EventClick(e, d) {
      if (this.brush_mode == true) return;
      if (this.selected.stu_IDs.includes(d.student_ID)) {
        this.selected.stu_IDs = this.selected.stu_IDs.filter(
          (id) => id != d.student_ID
        );
      } else {
        this.selected.stu_IDs.push(d.student_ID);
        // console.log(d.student_ID);
      }
      this.hightlightSelected();
      clusterStore().selected_students = [...this.selected.stu_IDs];
    },
    EventBrushing({ selection }) {
      if (this.brush_mode == false) return;
      const svg = d3.select(this.$refs.svg_container).select("svg");
      const [[x0, y0], [x1, y1]] = selection;
      d3
        .selectAll(".stroke-scatter")
        .attr('visibility', 'hidden');
      const circles = d3
        .selectAll(".stroke-scatter")
        .filter(
          (d) =>
            x0 <= this.xScale(d.x) &&
            this.xScale(d.x) < x1 &&
            y0 <= this.yScale(d.y) &&
            this.yScale(d.y) < y1
        ).attr('visibility', 'visible');
      const stuList = [];
      circles._groups[0].forEach((element) => {
        stuList.push(element.__data__.student_ID);
      });
      this.brush_students = stuList;
      
    },
    EventBrushEnd({ selection }) {
      if (this.brush_mode == false) return;
      this.selected.stu_IDs = this.brush_students;
      clusterStore().selected_students = [...this.selected.stu_IDs];
    },
    changeModel_Brush() {
      this.brush_mode = !this.brush_mode;
      const svg = d3.select(this.$refs.svg_container).select("svg");
      if (this.brush_mode) {
        svg.append("g").attr("class", "brush").call(this.brush);
      }else{
        svg.select(".brush").remove();
      }
    },
    confirmSearch() {
      // console.log(this.search_reault);
      if (this.search_reault != null) {
        if (!this.selected.stu_IDs.includes(this.search_reault)) {
          this.selected.stu_IDs.push(this.search_reault);
          this.hightlightSelected();
          clusterStore().selected_students = [...this.selected.stu_IDs];
        }
      }
      this.search_reault = null;
      this.search_dialog = false;
    },
    hightlightSelected() {
      d3.select(this.$refs.svg_container)
        .select(".g-stroke-scatter")
        .selectAll("circle")
        .attr("visibility", (d) =>
          this.selected.stu_IDs.includes(d.student_ID) ? "visible" : "hidden"
        );
    },
  },
};
</script>
<style scoped></style>
