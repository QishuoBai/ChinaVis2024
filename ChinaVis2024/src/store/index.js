import { defineStore } from "pinia";
import * as d3 from "d3";
import { adjustHexOpacity } from "@/utils/tool.js";

const title_score_base_color = d3.schemeCategory10[5];

export const clusterStore = defineStore("cluster", {
  state: () => {
    return {
      result: [],
      selected_cluster: -1, // 0 是全选 , -1 表示这个不用了
      // colors: ['#0079c3', '#f08300', '#00ada9'],
      colors: d3.schemeCategory10,
      // title_sun_color: '#d00000',
      // title_sun_color: '#fb6f92',
      title_sun_color: d3.schemeCategory10[3],
      title_score_colors: [0.2, 0.4, 0.6, 0.8, 1.0].map((d) =>
        adjustHexOpacity(title_score_base_color, d)
      ),
      selected_students: [],
      selected_knowledge: null, // ""是全选
      features4cluster: [],
      hoverTitleInfo: {
        show: false,
        title: null,
        score: null,
        sbmnum: null,
        difficulty: null,
      },
    };
  },
});
