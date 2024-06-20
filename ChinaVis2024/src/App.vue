<template>
  <div class="d-flex flex-column h-screen w-screen bg-grey-lighten-2">
    <div
      id="header"
      class="border-b-thin pa-1 px-3 bg-grey-darken-4 d-flex flex-row justify-space-between align-center"
    >
      <div class="text-h6">时序多变量教育数据可视分析系统</div>
      <div class="d-flex flex-row align-center">
        <div class="d-flex flex-row align-end mt-1">
          <div>Class:</div>
          <div
            style="border-bottom: 1px solid white; width: 70px"
            class="ml-1 d-flex flex-center justify-center"
          >
            <div>{{ cluster_config.class }}</div>
          </div>
        </div>
        <div class="d-flex flex-row align-end ml-10 mt-1">
          <div>Major:</div>
          <div
            style="border-bottom: 1px solid white; width: 70px"
            class="ml-1 d-flex flex-center justify-center"
          >
            <div>{{ cluster_config.major }}</div>
          </div>
        </div>
        <div class="ml-10">
          <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                color="white"
                icon="mdi-wrench"
                size="x-small"
                v-bind="activatorProps"
              ></v-btn>
            </template>

            <v-card>
              <v-card-title class="text-body-1">
                <v-icon icon="mdi-wrench" size="small"></v-icon>
                Cluster Configuration
              </v-card-title>

              <v-card-text
                ><div class="d-flex flex-row">
                  <v-select
                    v-model="cluster_config.class"
                    label="Class"
                    :items="classes"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                  <v-select
                    class="ml-5"
                    v-model="cluster_config.major"
                    label="Major"
                    :items="majors"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </div>
                <div
                  v-for="(item, index) in cluster_config.features"
                  :key="index"
                  class="d-flex flex-row rounded my-2 align-center px-2 justify-space-between"
                  :style="{
                    height: '70px',
                    border:
                      '1px solid ' + (item.use4cluster ? 'black' : '#00000010'),
                  }"
                >
                  <div>
                    <v-btn
                      class="text-body-2 bg-grey-lighten-4"
                      variant="text"
                      @click="item.use4cluster = !item.use4cluster"
                      >{{ item.label }}</v-btn
                    >
                  </div>
                  <div
                    class="h-100 d-flex flex-column"
                    :style="{ width: svg_width + 'px' }"
                  >
                    <div
                      class="flex-shrink-0"
                      :id="'svg-feature-density-container-' + index"
                      :style="{ height: svg_height + 'px' }"
                    ></div>
                    <div class="flex-grow-1">
                      <v-range-slider
                        strict
                        v-model="item.range"
                        :min="0"
                        :max="1"
                        :step="0.01"
                        :thumb-size="10"
                        :track-size="2"
                        thumb-label
                        class="mt-n2"
                        :color="color_dark"
                        :style="{ marginInline: '0px', color: color_light }"
                      />
                    </div>
                  </div>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  text="Confirm"
                  variant="text"
                  @click="dialog = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div class="ml-10">
          <v-btn size="small" @click="cluster()">Cluster</v-btn>
        </div>
      </div>
    </div>
    <div class="flex-grow-1 d-flex flex-row w-100">
      <div style="width: 80%" class="d-flex flex-column ma-1">
        <div class="w-100 d-flex flex-row mb-0" style="height: 40%">
          <div class="w-25 bg-white rounded"><Scatter /></div>
          <div class="flex-grow-1 ml-1 bg-white rounded"><Portrait /></div>
        </div>
        <div class="flex-grow-1 d-flex flex-row mt-1">
          <div class="w-50 h-100 mb-1 bg-white rounded"><TitleView /></div>
          <div class="w-50 h-100 mb-1 ml-1 bg-white rounded"><WeekView /></div>
        </div>
      </div>
      <div class="flex-grow-1 bg-white rounded ma-1 ml-0"></div>
        <!-- <div class="w-25 d-flex flex-column ma-1">
            <div class="h-50 w-100 mb-1 bg-white rounded">
                <Scatter />
            </div>
            <div class="h-50 w-100 bg-white rounded">
                <Portrait />
            </div>
        </div>
        <div class="flex-grow-1 d-flex flex-column ma-1 ml-0" style="width: 0px;">
            <div style="height: 60%;" class="mb-1 bg-white rounded">
                <WeekView />
            </div>
            <div style="height: 40%;" class="bg-white rounded">
                <TitleView />
            </div>
        </div> -->
        <div style="width: 80%;" class="d-flex flex-column ma-1">
            <div class="w-100 d-flex flex-row mb-0" style="height: 40%;">
                <div class="w-25 bg-white rounded"><Scatter /></div>
                <div class="flex-grow-1 ml-1 bg-white rounded"><Portrait /></div>
            </div>
            <div class="flex-grow-1 d-flex flex-row mt-1">
                <div class="w-50 h-100 mb-1 bg-white rounded"><TitleView /></div>
                <div class="w-50 h-100 mb-1 ml-1 bg-white rounded"><WeekView /></div>
            </div>
        </div>
        <div class="flex-grow-1 bg-white rounded ma-1 ml-0"><Student /></div>
    </div>
  </div>
</template>

<script>
//
import WeekView from "./components/WeekView.vue";
import Scatter from "./components/Scatter.vue";
import Portrait from "./components/Portrait.vue";
import TitleView from "./components/TitleView.vue";
import data_stu_features from "@/data/stu_features.json";
import * as d3 from "d3";
import { postRequest, getRequest } from "@/utils/tool.js";
import { clusterStore } from '@/store'

export default {
  components: {
    WeekView,
    Scatter,
    Portrait,
    TitleView,
  },
  data() {
    return {
      classes: [
        "All",
        ...Array.from({ length: 15 }, (_, i) => `Class${i + 1}`),
      ],
      majors: ["All", "J23517", "J40192", "J57489", "J78901", "J87654"],
      dialog: false,
      cluster_config: {
        class: "All",
        major: "All",
        features: [
          {
            name: "score_bonus",
            label: "Title Score",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "rank_bonus",
            label: "Rank Score",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "enthusiasm_bonus",
            label: "Enthusiasm Bonus",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "explore_bonus",
            label: "Explore Bonus",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "tc_bonus",
            label: "TC Bonus",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "mem_bonus",
            label: "Memory Bonus",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "_error_type_penalty",
            label: "ErrorType-Free Bonus",
            range: [0, 1],
            use4cluster: true,
          },
          {
            name: "_test_num_penalty",
            label: "TestNum-Free Bonus",
            range: [0, 1],
            use4cluster: true,
          },
        ],
      },
      svg_width: 350,
      svg_height: 50,
      color_dark: d3.schemeCategory10[0] + "ff",
      color_light: d3.schemeCategory10[0] + "1f",
    };
  },
  methods: {
    draw_feature_density_plot(name, index) {
      const data = data_stu_features.map((d) => d.features[name]);
      const width = this.svg_width;
      const height = this.svg_height;

      d3.select(`#svg-feature-density-container-${index}`).html("");

      // 创建 SVG 元素
      const svg = d3
        .select(`#svg-feature-density-container-${index}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("overflow", "visible");
      // 设置绘图区域的宽高
      const plotWidth = width;
      const plotHeight = height;

      // 创建一个分组用于绘图区域
      const g = svg.append("g").attr("transform", "translate(0, 5)");

      // 创建比例尺
      const xScale = d3.scaleLinear().domain([0, 1]).range([0, plotWidth]);

      const yScale = d3.scaleLinear().range([plotHeight - 5, 0]);

      // 计算频率分布（直方图的 bin）
      const histogram = d3
        .bin()
        .domain(xScale.domain())
        .thresholds(xScale.ticks(40)); // bin 的数量

      const bins = histogram(data);

      // 设置 y 轴的 domain 基于 bin 的数量
      yScale.domain([0, d3.max(bins, (d) => d.length)]);

      const color_dark = this.color_dark;
      const color_light = this.color_light;

      // 创建渐变
      let gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", `gradient-${index}`)
        .attr("x1", "0%") // 渐变开始的 x 坐标
        .attr("y1", "0%") // 渐变开始的 y 坐标
        .attr("x2", "0%") // 渐变结束的 x 坐标
        .attr("y2", "100%"); // 渐变结束的 y 坐标

      // 定义渐变起点的颜色
      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", color_dark); // 较深的颜色

      // 定义渐变终点的颜色
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color_light); // 较浅的颜色
      let area_generator = d3
        .area()
        .x((d) => xScale(d.x0))
        .y0(plotHeight)
        .y1((d) => (d.length == 0 ? plotHeight : yScale(d.length)))
        .curve(d3.curveCatmullRom.alpha(0.5));
      g.append("path")
        .datum(bins)
        .attr("d", area_generator)
        .attr("fill", `url(#gradient-${index})`);
    },
    cluster(){
        postRequest('/cluster', this.cluster_config).then((res) => {
          clusterStore().result = res.data;
        });
    }
  },
  watch: {
    dialog(newVal, oldVal) {
      console.log(newVal, oldVal);
      if (newVal) {
        this.$nextTick(() => {
          this.cluster_config.features.forEach((item, index) => {
            this.draw_feature_density_plot(item.name, index);
          });
        });
      }
    },
  },
  mounted() {
    this.cluster();
  },
};
</script>
<style scoped></style>
